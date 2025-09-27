import Material from '../models/Material.js';
import User from '../models/User.js';
import {body, param, validationResult} from 'express-validator';
import {createError} from '../utils/error.js';

// SECURITY: Validation schemas
export const createMaterialValidation = [
  body('subject').trim().isLength({min: 2, max: 100}).withMessage('Subject must be between 2 and 100 characters'),
  body('semester').isInt({min: 1, max: 8}).withMessage('Semester must be between 1 and 8'),
  body('instructorName').isArray({min: 1}).withMessage('At least one instructor name is required'),
  body('instructorName.*').trim().isLength({min: 2, max: 50}).withMessage('Instructor name must be between 2 and 50 characters'),
  body('materialLink').isURL().withMessage('Material link must be a valid URL'),
  body('desc').optional().trim().isLength({max: 500}).withMessage('Description cannot exceed 500 characters'),
  body('author').isArray({min: 1}).withMessage('At least one author is required'),
  body('author.*').trim().isLength({min: 2, max: 50}).withMessage('Author name must be between 2 and 50 characters'),
  body('yearOfWriting').isInt({min: 2000, max: new Date().getFullYear()}).withMessage('Year must be valid'),
  body('branch').isArray({min: 1}).withMessage('At least one branch is required'),
  body('materialType').trim().isLength({min: 2, max: 50}).withMessage('Material type is required'),
  body('thumbnail').custom((value) => {
    // SECURITY: Validate Google Drive URL format
    const driveUrlRegex = /^https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9-_]+)/;
    if (!driveUrlRegex.test(value)) {
      throw new Error('Thumbnail must be a valid Google Drive URL');
    }
    return true;
  })
];

export const materialIdValidation = [
  param('id').isMongoId().withMessage('Invalid material ID')
];

export const materialTypeValidation = [
  param('materialType').trim().isLength({min: 2, max: 50}).withMessage('Invalid material type')
];

export const upvoteValidation = [
  body('materialId').isMongoId().withMessage('Invalid material ID'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
];


export const createMaterial = async (req, res, next) => {
  try {
    // SECURITY: Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(400, errors.array()[0].msg));
    }

    // SECURITY: Safely extract Google Drive file ID
    const driveUrlRegex = /^https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9-_]+)/;
    const match = req.body.thumbnail.match(driveUrlRegex);

    if (!match) {
      return next(createError(400, 'Invalid Google Drive URL format'));
    }

    const fileId = match[1];
    const secureLink = `https://drive.google.com/uc?export=view&id=${fileId}`;

    // SECURITY: Check for duplicate material links
    const existingMaterial = await Material.findOne({
      materialLink: req.body.materialLink
    });

    if (existingMaterial) {
      return next(createError(409, 'Material with this link already exists'));
    }

    const newMaterial = new Material({
      subject: req.body.subject,
      semester: req.body.semester,
      instructorName: req.body.instructorName,
      courseCode: req.body.courseCode || '', // SECURITY: Handle optional field
      materialLink: req.body.materialLink,
      desc: req.body.desc || '', // SECURITY: Handle optional field
      author: req.body.author,
      yearOfWriting: req.body.yearOfWriting,
      branch: req.body.branch,
      materialType: req.body.materialType,
      thumbnail: secureLink,
      featured: Boolean(req.body.featured), // SECURITY: Ensure boolean
      contributedBy: req.body.contributedBy || 'Admin',
      verifiedBy: req.body.verifiedBy || 'notVerified'
    });

    const savedMaterial = await newMaterial.save();
    res.status(201).json({
      message: 'Material created successfully',
      material: savedMaterial
    });
  } catch (err) {
    if (err.code === 11000) {
      // SECURITY: Handle duplicate key error
      return next(createError(409, 'Material with this information already exists'));
    }
    next(err);
  }
};

export const updateMaterial = async (req, res, next) => {
  try {
    // SECURITY: Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(400, errors.array()[0].msg));
    }

    // SECURITY: Handle Google Drive URL if provided
    if (req.body.thumbnail) {
      const driveUrlRegex = /^https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9-_]+)/;
      const match = req.body.thumbnail.match(driveUrlRegex);

      if (!match) {
        return next(createError(400, 'Invalid Google Drive URL format'));
      }

      const fileId = match[1];
      req.body.thumbnail = `https://drive.google.com/uc?export=view&id=${fileId}`;
    }

    // SECURITY: Prevent updating certain fields
    const {_id: _idField, createdAt: _createdAt, updatedAt: _updatedAt, ...allowedUpdates} = req.body;

    const updateMaterial = await Material.findByIdAndUpdate(
      req.params.id,
      {$set: allowedUpdates},
      {new: true, runValidators: true} // SECURITY: Run mongoose validators
    );

    if (!updateMaterial) {
      return next(createError(404, 'Material not found'));
    }

    res.status(200).json({
      message: 'Material updated successfully',
      material: updateMaterial
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(createError(409, 'Material with this information already exists'));
    }
    next(err);
  }
};

export const deleteMaterial = async (req, res, next) => {
  try {
    // SECURITY: Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(400, errors.array()[0].msg));
    }

    const deletedMaterial = await Material.findByIdAndDelete(req.params.id);

    if (!deletedMaterial) {
      return next(createError(404, 'Material not found'));
    }

    res.status(200).json({message: 'Material deleted successfully'});
  } catch (err) {
    next(err);
  }
};

export const getMaterial = async (req, res, next) => {
  try {
    // SECURITY: Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(400, errors.array()[0].msg));
    }

    const material = await Material.findById(req.params.id);

    if (!material) {
      return next(createError(404, 'Material not found'));
    }

    res.status(200).json(material);
  } catch (err) {
    next(err);
  }
};

export const getMaterials = async (req, res, next) => {
  try {
    // SECURITY: Add pagination to prevent data exposure
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    // SECURITY: Limit maximum results per page
    const maxLimit = 100;
    const finalLimit = limit > maxLimit ? maxLimit : limit;

    // SECURITY: Add filtering options
    const filter = {
      $or: [
        {verifiedBy: 'verified'}, // Show approved materials
        {verifiedBy: {$exists: false}}, // Show existing materials without verification field (backward compatibility)
        {verifiedBy: 'notVerified'} // Show existing materials with notVerified status
      ]
    };
    if (req.query.materialType) {
      filter.materialType = req.query.materialType;
    }
    if (req.query.semester) {
      filter.semester = parseInt(req.query.semester, 10);
    }
    if (req.query.branch) {
      filter.branch = {$in: [req.query.branch]};
    }

    const materials = await Material.find(filter)
      .skip(skip)
      .limit(finalLimit)
      .sort({createdAt: -1});

    const totalMaterials = await Material.countDocuments(filter);
    const totalPages = Math.ceil(totalMaterials / finalLimit);

    res.status(200).json({
      materials,
      pagination: {
        currentPage: page,
        totalPages,
        totalMaterials,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getMaterialByType = async (req, res, next) => {
  try {
    // SECURITY: Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(400, errors.array()[0].msg));
    }

    // SECURITY: Add pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const maxLimit = 100;
    const finalLimit = limit > maxLimit ? maxLimit : limit;

    const materials = await Material.find({
      materialType: req.params.materialType,
      $or: [
        {verifiedBy: 'verified'}, // Show approved materials
        {verifiedBy: {$exists: false}}, // Show existing materials without verification field (backward compatibility)
        {verifiedBy: 'notVerified'} // Show existing materials with notVerified status
      ]
    })
      .skip(skip)
      .limit(finalLimit)
      .sort({createdAt: -1});

    const totalMaterials = await Material.countDocuments({
      materialType: req.params.materialType,
      $or: [
        {verifiedBy: 'verified'}, // Show approved materials
        {verifiedBy: {$exists: false}}, // Show existing materials without verification field (backward compatibility)
        {verifiedBy: 'notVerified'} // Show existing materials with notVerified status
      ]
    });
    const totalPages = Math.ceil(totalMaterials / finalLimit);

    res.status(200).json({
      materials,
      pagination: {
        currentPage: page,
        totalPages,
        totalMaterials,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    next(err);
  }
};

export const upvoteMaterial = async (req, res, next) => {
  try {
    // SECURITY: Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(400, errors.array()[0].msg));
    }

    const {materialId, email} = req.body;

    // SECURITY: Verify user exists and is verified
    const user = await User.findOne({email: email, isVerified: true});
    if (!user) {
      return next(createError(404, 'User not found or not verified'));
    }

    const material = await Material.findById(materialId);
    if (!material) {
      return next(createError(404, 'Material not found'));
    }

    // SECURITY: Check if user has already upvoted
    const hasUpvoted = material.upvotes.includes(email);

    let updateMaterial;
    if (hasUpvoted) {
      // Remove upvote
      updateMaterial = await Material.findByIdAndUpdate(
        materialId,
        {$pull: {upvotes: email}},
        {new: true}
      );
    } else {
      // Add upvote
      updateMaterial = await Material.findByIdAndUpdate(
        materialId,
        {$push: {upvotes: email}},
        {new: true}
      );
    }

    res.status(200).json({
      message: hasUpvoted ? 'Upvote removed' : 'Material upvoted',
      material: updateMaterial,
      upvoteCount: updateMaterial.upvotes.length
    });
  } catch (err) {
    next(err);
  }
};

