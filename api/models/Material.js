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
    }
  },
  { timestamp: true }
);

export default mongoose.model("Material", materialSchema);
