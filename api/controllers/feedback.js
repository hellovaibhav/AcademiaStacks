import Feedback from "../models/Feedback.js";


export const createFeedback = async (req, res, next) => {

    try {

            const newFeedback = new Feedback({
                name: req.body.name,
                email: req.body.email,
                type: req.body.type,
                message: req.body.message,
            });

        const savedFeedback = await newFeedback.save();
        res.status(200).json(savedFeedback);

    } catch (err) {
        next(err);
    }
};
