import express from "express";
import connectionRequest from "../Models/connectionRequest.model.js";
import User from "../Models/user.model.js";
import notificationModel from "../Models/notification.model.js";

export const sendConnectionRequest = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (req.user._id.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ message: "You can't send connection request to yourself" });
    }
    if (req.user.connections.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You both are already connected" });
    }
    const existingConnection = await connectionRequest.findOne({
      sender: req.user._id,
      recipient: userId,
      status: "pending",
    });
    if (existingConnection)
      return res
        .status(400)
        .json({ message: "You have already sent a connection" });

    const newConnection = new connectionRequest({
      sender: req.user._id,
      recipient: userId,
      status: "pending",
    });
    await newConnection.save();
    res.status(200).json({ message: "Connection sent successfully" });
  } catch (error) {
    console.log(
      "Error occured in sendConnectionRequest controller",
      error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    if (req.user.connections.includes(requestId))
      return res.status(400).json({ message: "You are already connected" });
    const isRequesexist = await connectionRequest.findOne({
      sender: requestId,
      recipient: req.user._id,
      status: "pending",
    });
    if (!isRequesexist)
      return res
        .status(400)
        .json({ message: "Connection request from the user doesn't exist" });
    const delConnectionRequest = await connectionRequest.findByIdAndDelete(
      isRequesexist._id
    );
    const sender = await User.findById(requestId);
    sender.connections.push(req.user._id);
    await sender.save();
    const currentUser = await User.findById(req.user._id);
    currentUser.connections.push(requestId);
    await currentUser.save();
    req.user = currentUser;
    const newNotification = new notificationModel({
      recipient: requestId,
      type: "connectionAccepted",
      relatedUser: req.user._id,
    });
    await newNotification.save();
    res.status(200).json({ message: "Connection request accepted" });
  } catch (error) {
    console.log(
      "Error occured in acceptConnectionRequest controller",
      error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

export const rejectConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const isRequesexist = await connectionRequest.findOne({
      sender: requestId,
      recipient: req.user._id,
      status: "pending",
    });
    if (!isRequesexist)
      return res
        .status(400)
        .json({ message: "Connection request from the user doesn't exist" });
    const delConnectionRequest = await connectionRequest.findByIdAndDelete(
      isRequesexist._id
    );
    res.status(200).json({ message: "Connection request rejected" });
  } catch (error) {
    console.log(
      "Error occured in acceptConnectionRequest controller",
      error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

export const generateAllConnectionRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await connectionRequest
      .find({
        recipient: userId,
        status: "pending",
      })
      .populate("sender", "name username profilePicture email headline");
    res.status(200).json(requests);
  } catch (error) {
    console.log(
      "Error occured in generateAllConnectionRequests controller",
      error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "connections",
      "name username email profilePicture headline"
    );
    return res.status(200).json(user.connections);
  } catch (error) {
    console.log(
      "Error occured in getUserConnections controller",
      error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeConnection = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const currentUser = await User.findById(req.user._id);
    user.connections = user.connections.filter(
      (id) => id.toString() != req.user._id.toString()
    );
    await user.save();
    currentUser.connections = currentUser.connections.filter(
      (id) => id.toString() != userId.toString()
    );
    await currentUser.save();
    req.user = currentUser;
    return res.status(200).json({ message: "connection removed successfully" });
  } catch (error) {
    console.log("Error occured in removeConnection controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getConnectionStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.connections.includes(userId))
      return res.status(200).json({ status: "connected" });
    const pendingRequest = await connectionRequest.findOne({
      $or: [
        { sender: userId, recipient: req.user._id },
        { sender: req.user._id, recipient: userId },
      ],
      status: "pending",
    });

    if (pendingRequest) {
      if (pendingRequest.sender.toString() === req.user._id.toString()) {
        return res.status(200).json({ status: "pending" });
      }
      if (pendingRequest.recipient.toString() === req.user._id.toString()) {
        return res.status(200).json({ status: "recieved" });
      }
    }
    return res.status(200).json({ status: "not_connected" });
  } catch (error) {
    console.log(
      "Error occured in getConnectionStatus controller",
      error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
};
