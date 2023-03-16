import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: { 
        type: String, 
        require: true, 
        unique:true,    
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    branch: {
        type: String,
        required: true
    },
    batch: {
        type: Number,
        required: true
    }
}, { timestamp: true });


export default mongoose.model("User", userSchema);