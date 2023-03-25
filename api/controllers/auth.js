
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";



export const register = async (req, res, next) => {

  const senderMail = process.env.MAILID;
  const senderPass = process.env.MAILPASS;

  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
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

    // newUser.index({ "lastModifiedDate": 1 }, { expireAfterSeconds: 20, partialFilterExpression: { isVerified: false } });

    var mailOptions = {
      from: senderMail,
      to: req.body.email,
      subject: "Academia Stacks One Time Password ",
      html: "<html><body align=\"center\" bgcolor=\"#EDF1D6\"><p>We are happy to see that you want to join Academia Stacks and dig deep into the ocean of knowledge</p><br><h3> Here is your OTP </h3><br><h1>" + otpCode + " </h1><p>Please enter this within 24-hours to activate your account.</p></body></html>"
    };

    const checkUser = await User.findOne({ email: req.body.email });

    if (!checkUser) {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email Sent');
        }
      });
    } else {
      console.log("The account associated with this email address already exists");
    }

    const saveduser = await newUser.save();
    res.status(200).json(saveduser);


  } catch (err) {
    next(err);
  }
};


export const registerVerify = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));


    if (req.body.otp != user.otp) {
      return next(createError(400, "Wrong OTP!"));
    } else {
      const doc = await User.findOneAndUpdate({ email: req.body.email }, { isVerified: true, otp:null }, { new: true });
      res.status(200).json(doc.name + " is now verified " + doc.isVerified);
    }

  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));
    if (user.isVerified == false) return next(createError(401, "User not verified please input otp"));

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
