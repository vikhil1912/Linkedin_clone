import express from "express";
import notificationModel from "../Models/notification.model.js";

export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel
      .find({ recipient: req.user._id })
      .populate("relatedUser", "name username porfilePicture email headline")
      .populate("relatedPost", "content image");
    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getUserNotifications controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notfication = await notificationModel.findOneAndUpdate(
      {
        _id: notificationId,
        recipient: req.user._id,
      },
      { read: true },
      { new: true }
    );
    res.json(notfication);
  } catch (error) {
    console.log("Error in markNotificationRead controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    await notificationModel.findOneAndDelete({
      _id: notificationId,
      recipient: req.user._id,
    });
    res.json({ message: "Notification successfully deleted" });
  } catch (error) {
    console.log("Error in deleteNotification controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
