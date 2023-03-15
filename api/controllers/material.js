import Material from "../models/Material.js";

export const createMaterial = async (req, res, next) => {

    const newMaterial = new Material(req.body);

    try {
        const savedMaterial = await newMaterial.save();
        res.status(200).json(savedMaterial);
    } catch (err) {
        next(err);
    }

};

export const updateMaterial = async (req, res, next) => {


    try {
        const updateMaterial = await Material.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updateMaterial);
    } catch (err) {
        next(err);
    }

};

export const deleteMaterial = async (req, res, next) => {

    try {
        await Material.findByIdAndDelete(req.params.id);
        res.status(200).json("Material Deleted");
    } catch (err) {
        next(err);
    }

};

export const getMaterial = async (req, res, next) => {


    try {
        const material = await Material.findById(req.params.id);
        res.status(200).json(material);
    } catch (err) {
        next(err);
    }
};

export const getMaterials = async (req, res, next) => {

    try {
        const materials = await Material.find();
        res.status(200).json(materials);
    } catch (err) {
        next(err);
    }

}

