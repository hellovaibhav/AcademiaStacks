import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    instructorName: [{
      type: String,
      required: true,
    }],
    courseCode: {
      type: String,
      // required: true
    },
    materialLink: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
    },
    author: [{
      type: String,
      required: true,
    }],
    yearOfWriting: {
      type: Number,
      required: true,
    },
    branch: [
      {
        type: String,
        required: true,
      },
    ],
    contributedBy:{
      type:String,
      default:"Admin"
    },
    materialType: {
      type: String
    },
    thumbnail: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    upvotes: [
      {
        type: String,
        default: "0",
      },
    ],
    verifiedBy:{
      type:String,
      default:"notVerified"
    },
    driveFileId: {
      type: String,
      // Google Drive file ID for uploaded files
    },
    driveThumbnailId: {
      type: String,
      // Google Drive thumbnail file ID
    },
    fileSize: {
      type: Number,
      // File size in bytes
    },
    uploadDate: {
      type: Date,
      default: Date.now
    },
    verifiedAt: {
      type: Date
    },
    verifiedByAdmin: {
      type: String
    },
    rejectedAt: {
      type: Date
    },
    rejectedByAdmin: {
      type: String
    },
    rejectionReason: {
      type: String
    },
    adminNotes: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Material", materialSchema);
