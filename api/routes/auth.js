import express from "express";
import { login, register, registerVerify } from "../controllers/auth.js";
import cors from "cors";

const router = express.Router();

router.get("/register", cors(), (req, res) => {

});


router.post("/register", register);
router.post("/verification", registerVerify);
router.post("/login", login);

export default router;