import express from "express";
import Post from "../Models/post.model.js";
import cloudinary from "../lib/cloudinary.js";
import notificationModel from "../Models/notification.model.js";
import { sendCommentNotificationEmail } from "../Emails/emailHandler.js";

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: { $in: [...req.user.connections, req.user._id] },
    })
      .populate("author", "name username profilepicture headline")
      .populate("comments.user", "name profilepicture")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.log("error in getFeesPosts controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;

    let newPost;
    if (image) {
      const imageResult = await cloudinary.uploader.upload(image);
      newPost = new Post({
        author: req.user._id,
        content: content,
        image: imageResult.secure_url,
      });
    } else {
      newPost = new Post({
        author: req.user._id,
        content: content,
      });
    }
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log("error occured while posting", error.message);
    res.status(500).json({ message: "Internal error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    if (post.image) {
      await cloudinary.uploader.destroy(
        post.image.split("/").pop().split(".")[0]
      );
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "post deleted successfully" });
  } catch (error) {
    console.log(
      "error occured while deleting post in controller",
      error.message
    );

    res.status(500).json({ message: "Internal error in server" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate("author", "name profilepicture username headline")
      .populate("comments.user", "name profilepicture username headline");
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.log("Error occured in getPostById controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    const post = await Post.findByIdAndUpdate(postId, {
      $push: { comments: { content: content, user: req.user._id } },
    }).populate("author", "name email username profilepicture headline");
    // create notification
    if (post.author._id.toString() !== req.user._id.toString()) {
      const notification = new notificationModel({
        recipient: post.author,
        type: "comment",
        relatedUser: req.user._id,
        relatedPost: post._id,
      });

      await notification.save();

      // try {
      //   const postUrl = process.env.CLIENT_URL + "/post/" + postId;
      //   await sendCommentNotificationEmail(
      //     post.author.name,
      //     req.user.name,
      //     postUrl,
      //     content
      //   );
      // } catch (error) {
      //   console.log("Error in sending comment notifications", error.message);
      //   throw error;
      // }
    }
    res.status(201).json({ message: "Comment successfully created" });
  } catch (error) {
    console.log("error occured in createComment controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (post.likes.includes(req.user._id)) {
      //unlike the post
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      post.likes.push(req.user._id);
      //create notification
      if (post.author.toString() !== req.user._id.toString()) {
        const notification = new notificationModel({
          recipient: post.author,
          type: "like",
          relatedUser: req.user._id,
          relatedPost: postId,
        });
        await notification.save();
      }
    }
    await post.save();
    res.status(200).json({ message: "Successfully liked the post" });
  } catch (error) {
    console.log("Error occured in likePost controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
