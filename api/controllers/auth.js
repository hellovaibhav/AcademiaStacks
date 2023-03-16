import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
// import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      name:req.body.name,
      email:req.body.email,
      username:req.body.email,
      password: hash,
      branch:req.body.branch,
      batch:req.body.batch
      
    });

    await newUser.save();
    res.status(200).send("User has been created.");
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
    return next(createError(400, "Wrong password or username!"));
    

    // const token = jwt.sign(
    //   { id: user._id, isAdmin: user.isAdmin },
    //   process.env.JWT
    // );

    // const { password, isAdmin, ...otherDetails } = user._doc;
    // .cookie("access_token", token, {
    //   httpOnly: true,
    // })
    res.status(200)
      .json(user);
  } catch (err) {
    next(err);
  }
};