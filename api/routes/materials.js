import express from "express"
import { createMaterial, deleteMaterial, getMaterial, getMaterialByType, getMaterials, updateMaterial } from "../controllers/material.js";
import Material from "../models/Material.js";
import { createError } from "../utils/error.js";

const router = express.Router();


// crete new material

router.post("/", createMaterial);


// update the uploaded material

router.put("/:materialType/:id", updateMaterial);

// delete a selected material

router.delete("/:materialType/:id", deleteMaterial);

// get a particular material

router.get("/:materialType/:id", getMaterial);

// get all material
router.get("/", getMaterials);

router.get("/:materialType", getMaterialByType);

export default router;