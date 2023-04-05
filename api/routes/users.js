import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  saveItem,
} from "../controllers/user.js";
import {  verifyToken ,verifyUser,verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/checkauthentication", verifyToken, (req,res,next)=>{
  res.send("hello user, you are logged in")
})

router.get("/checkuser/:id", verifyUser, (req,res,next)=>{
  res.send("hello user, you are logged in and you can delete your account")
})

router.get("/checkadmin/:id", verifyAdmin, (req,res,next)=>{
  res.send("hello admin, you are logged in and you can delete all accounts")
})

//UPDATE FOR BOTH USER AND ADMIN
router.put("/modify/:id", verifyUser, updateUser);

//DELETE FOR BOTH USER AND ADMIN
router.delete("/modify/:id", verifyUser, deleteUser);

//GET FOR BOTH USER AND ADMIN
router.get("/modify/:id", verifyUser, getUser);

//GET ALL FOR  ADMIN ONLY
router.get("/",verifyAdmin,  getUsers);

// Save fav material in your profile
router.post("/saveItem",saveItem)

export default router;  