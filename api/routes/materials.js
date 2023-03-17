import express from "express"
import { createMaterial, deleteMaterial, getMaterial, getMaterials, updateMaterial } from "../controllers/material.js";
import Material from "../models/Material.js";
import { createError } from "../utils/error.js";

const router = express.Router();


// crete new material

router.post("/", createMaterial);


// update the uploaded material

router.put("/:id", updateMaterial);

// delete a selected material

router.delete("/:id", deleteMaterial);

// get a particular material

router.get("/:id", getMaterial);

// get all material
router.get("/", getMaterials);

export default router;