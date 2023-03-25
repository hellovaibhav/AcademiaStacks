import Material from "../models/Material.js";
import User from "../models/User.js";



export const createMaterial = async (req, res, next) => {

    var naming = req.body.thumbnail;
    var link = "https://drive.google.com/uc?export=view&id=" + naming.split("/")[5];

    const newMaterial = new Material({
        subject: req.body.subject,
        semester: req.body.semester,
        instructorName: req.body.instructorName,
        courseCode: req.body.courseCode,
        materialLink: req.body.materialLink,
        desc: req.body.desc,
        author: req.body.author,
        yearOfWriting: req.body.yearOfWriting,
        branch: req.body.branch,
        materialType: req.body.materialType,
        thumbnail: link,
        featured: req.body.featured
    });

    try {
        const savedMaterial = await newMaterial.save();
        res.status(200).json(savedMaterial);
    } catch (err) {
        next(err);
    }

};

export const updateMaterial = async (req, res, next) => {


    try {
        const updateMaterial = await Material.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updateMaterial);
    } catch (err) {
        next(err);
    }

};

export const deleteMaterial = async (req, res, next) => {

    try {
        await Material.findByIdAndDelete(req.params.id);
        res.status(200).json("Material Deleted");
    } catch (err) {
        next(err);
    }

};

export const getMaterial = async (req, res, next) => {


    try {
        const material = await Material.findById(req.params.id);
        res.status(200).json(material);
    } catch (err) {
        next(err);
    }
};

export const getMaterials = async (req, res, next) => {

    try {
        const materials = await Material.find();
        res.status(200).json(materials);
    } catch (err) {
        next(err);
    }

};

export const getMaterialByType = async (req, res, next) => {

    try {

        const materials = await Material.find({ materialType: req.params.materialType });
        res.status(200).json(materials);
    } catch (err) {
        next(err);
    }

};

export const upvoteMaterial = async (req, res, next) => {

    try {

        const user = User.findOne({ email: req.body.email });

        if (!user) {
            const updateMaterial = await Material.findOneAndUpdate({ email: req.body.email }, { $push: { upvotes: req.body.userid } }, { new: true });
            res.status(200).json(updateMaterial);
        } else {
            const updateMaterial = await Material.findOneAndUpdate({ email: req.body.email }, { $pull: { upvotes: req.body.userid } }, { new: true });
            res.status(200).json(updateMaterial);
        }

    } catch (err) {
        next(err);
    }

};

