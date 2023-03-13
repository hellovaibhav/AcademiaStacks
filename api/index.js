import express from "express";
import bodyparser from "body-parser";
import mongoose from "mongoose";
import _ from "lodash";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import dotenv from 'dotenv'


const app = express();


dotenv.config();
const jsonwebtoken = require("jsonwebtoken");
mongoose.set('strictQuery', false);



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



app.get("/", function (req, res) {
    res.send("GET Request Called");
})

app.listen(3000, function () {
    console.log("server started at port 3000")
})