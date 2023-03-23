import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    fname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        require: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    branch: {
        type: String,
        required: true
    },
    batch: {
        type: Number,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    otp: {
        type: Number
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


userSchema.plugin(passportLocalMongoose);


export default mongoose.model("User", userSchema);