import express from "express"

const router = express.Router();

router.get("/",(req,res)=>{
    res.send("this is auth endpoint");
});


router.get("/user",(req,res)=>{
    res.send("this is auth user endpoint");
});


export default router