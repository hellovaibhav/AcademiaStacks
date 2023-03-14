import express from "express"
import Material from "../models/Material.js";

const router = express.Router();

router.get("/", async (req, res) => {

    const newMaterial = new Material(req.body);

    try {
        const savedMaterial = await newMaterial.save();
        res.status(200).json(savedMaterial);
    } catch (err) {
        res.status.json(err);
    }
    
});


export default router