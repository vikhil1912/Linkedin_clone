import User from "../Models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const generateSuggestedConnections = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).select("connections");
    const suggestUsers = await User.find({
      _id: {
        $ne: req.user._id,
        $nin: currentUser.connections,
      },
    })
      .select("name username profilepicture headline")
      .limit(5);
    res.status(200).json(suggestUsers);
  } catch (error) {
    res.status(500).json({ message: `Internal error ${error.message}` });
  }
};

export const generatePublicProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password"
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: `Internal error ${error.message}` });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "username",
      "headline",
      "about",
      "location",
      "profilepicture",
      "bannerimage",
      "skills",
      "experience",
      "education",
    ];

    const updateData = {};
    console.log(req.body);

    for (const field of allowedFields) {
      if (req.body[field]) {
        updateData[field] = req.body[field];
      }
    }
    if (req.body["profilepicture"]) {
      // console.log(req.body["profilepicture"]);

      const result = await cloudinary.uploader.upload(
        req.body["profilepicture"]
      );
      updateData.profilepicture = result.secure_url;
      // console.log(result.secure_url);
    }
    if (req.body["bannerimage"]) {
      const result = await cloudinary.uploader.upload(req.body["bannerimage"]);
      updateData.bannerimage = result.secure_url;
    }
    // console.log(updateData);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    );
    req.user = user;
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal error" });
  }
};
