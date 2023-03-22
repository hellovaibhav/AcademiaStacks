
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";



export const register = async (req, res, next) => {

  const senderMail = process.env.MAILID;
  const senderPass = process.env.MAILPASS;

  var transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 465,
    secure: true, //ssl
    auth: {
      user: senderMail,
      pass: senderPass
    }
  });

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    var str = req.body.email;
    var name = str.split("@")[0];

    var naming = req.body.name;
    var firstname = naming.split(" ")[0];

    var otpCode = Math.floor(100000 + Math.random() * 900000);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: name,
      password: hash,
      branch: req.body.branch,
      batch: req.body.batch,
      isAdmin: req.body.isAdmin,
      fname: firstname,
      otp: otpCode
    });

    newUser.index({ "lastModifiedDate": 1 }, { expireAfterSeconds: 20, partialFilterExpression: { isVerified: false } });

    var mailOptions = {
      from: senderMail,
      to: req.body.email,
      subject: "Academia Stacks One Time Password ",
      text: "We are happy to see that you want to join Academia Stacks and boost up your academic skills here is your otp : " + otpCode + " please do fill this within 24-hours to activate your account."
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    const saveduser = await newUser.save();
    res.status(200).json(saveduser);


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


    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );


    //whatever w give in other than otherDetails in curly bracktes that will be removed from output
    const { password, isAdmin, _id, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      }).status(200)
      .json({ details: { ...otherDetails } });
  } catch (err) {
    next(err);
  }
};
