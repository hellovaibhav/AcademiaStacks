import express from "express"
import Material from "../models/Material.js";

const router = express.Router();


// crete new material


router.post("/", async (req, res) => {

    const newMaterial = new Material(req.body);

    try {
        const savedMaterial = await newMaterial.save();
        res.status(200).json(savedMaterial);
    } catch (err) {
        res.status.json(err);
    }

});


// update the uploaded material

router.put("/:id", async (req, res) => {


    try {
        const updateMaterial = await Material.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updateMaterial);
    } catch (err) {
        next(err);
    }

});

// delete a selected material

router.delete("/:id", async (req, res) => {

    try {
        await Material.findByIdAndDelete(req.params.id);
        res.status(200).json("Material Deleted");
    } catch (err) {
        next(err);
    }

});

// get a particular material

router.get("/:id", async (req, res) => {


    try {
        const material = await Material.findById(req.params.id);
        res.status(200).json(material);
    } catch (err) {
        next(err);
    }
});

// get all material
router.get("/", async (req, res,next) => {

    try {
        const materials = await Material.findByIdAndUpdate("asfafef");
        res.status(200).json(materials);
    } catch (err) {
        next(err);
    }
});

export default router