import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
    instructorName: {
        type: String,
        required: true
    },
    materialLink:{
        type:String,
        required:true,
        unique:true
    },
    subject: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true
    },
    yearOfWriting: {
        type: Number,
        required:true
    },
    branch: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    materialType:{
        type:String,
        required:true
    }
}, { timestamp: true });


export default mongoose.model("Material", materialSchema);