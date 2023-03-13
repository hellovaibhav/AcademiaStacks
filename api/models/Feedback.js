import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    feedback: {
        type: String,
        required: true
    }
}, { timestamp: true });


export default mongoose.model("Feedback", feedbackSchema);