import express from "express";
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const _=require("lodash");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
import dotenv from 'dotenv'
dotenv.config();
const jsonwebtoken=require("jsonwebtoken");
mongoose.set('strictQuery', false);


const app = express();
app.use(cookieParser());

app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));
//mongoose.connect("mongodb+srv://NISHANT-KUMAR:Nishant@cluster0.inlg3l8.mongodb.net/todolistDB", { useNewUrlparser: true });


//BCRYPT
const password = 'oe3im3io2r3o2'
const rounds = 10

bcrypt.hash(password, rounds, (err, hash) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(hash)
})
app.post("/", function (req, res) {

    res.send("POST Request Called");
  
  });



app.get("/",function(req,res){
    res.send("GET Request Called");
})

app.listen(3000, function () {
  console.log("server started at port 3000")
})