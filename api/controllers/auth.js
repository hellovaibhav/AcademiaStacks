import User from "../models/User.js";

export const register = async (req, res, next) => {

    try {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            branch: req.body.branch,
            batch: req.body.batch,
        });

        await newUser.save();

        res.status(200).send("You have been successfully registered");
    } catch (err) {

    }
};