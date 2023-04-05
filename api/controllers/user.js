import User from "../models/User.js";

export const updateUser = async (req,res,next)=>{
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}
export const deleteUser = async (req,res,next)=>{
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
}
export const getUser = async (req,res,next)=>{
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}
export const getUsers = async (req,res,next)=>{
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};



export const saveItem = async (req, res, next) => {

  try {
      const user = await User.findOne({"email":req.body.email});

      console.log(req.body.email);

      var foundMaterial = user.savedMaterial.find(function (element) {
          return element == req.body.materialId;
      });
 
      console.log(foundMaterial);

      if (foundMaterial != "") {
          if (!foundMaterial) {
              const updateUser = await User.findByIdAndUpdate(req.body.userId, { $push: { savedItem: req.body.materialId } }, { new: true });
              res.status(200).json(updateUser);
          } else {
              const updateUser = await User.findByIdAndUpdate(req.body.userId, { $pull: { savedItem: req.body.materialId } }, { new: true });
              res.status(200).json(updateUser);
          }
      } else {
          console.log("Please login again !");
      }

  } catch (err) {
      next(err);
  }

};

