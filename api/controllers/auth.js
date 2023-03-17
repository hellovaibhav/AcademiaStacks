import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";

import User from "../models/User.js";

User.plugin(passportLocalMongoose);

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


export const register = async (req, res, next) => {

    try {
        const newUser = {
            name: req.body.name,
            username: req.body.email,
            email: req.body.email,
            branch: req.body.branch,
            batch: req.body.batch
        }

        User.register(newUser, req.body.password, (err, user) => {
            if (err) {
                next(err);
                // res.redirect("/register") 
                console.log("sab badhiya nhi hai");
            }
            else {
                //A new user was saved
                passport.authenticate("local")(req, res, () => {
                    // res.redirect("/api/material/")
                    console.log("successfully registered");
                });
                res.status(200).send("You have been successfully registered");
            }
        });
    } catch (err) {
        next(err);
    }
};