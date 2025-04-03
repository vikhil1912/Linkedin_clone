import User from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { sendWelcomeEmail } from "../Emails/emailHandler.js";

export const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const existingEmail = await User.findOne({ email: email });
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      return res.status(400).json({ message: "username already exists" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be atleast of 6 characters" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name: name,
      username: username,
      password: hashPassword,
      email: email,
    });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.cookie("jwt-linkedin", token, {
      httpOnly: true, //prevents accessing of cookie using javascript
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict", // prevents csrf attacks
      secure: process.env.NODE_ENV === "production", //prevents man-in-middle attacks
    });
    res.status(201).json({ message: "User is sucessfully created" });

    //todo send welcome email
    // const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username;
    // try {
    //   await sendWelcomeEmail(user.name, user.email, profileUrl);
    // } catch (error) {
    //   console.log(`internal error while sending welcome mail ${error.message}`);
    //   throw error;
    // }
  } catch (error) {
    console.log(`error in signup ${error.message}`);
    res.status(501).json({ message: "Internal error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credintials" });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ message: "Invalid credintials" });
    }
    const Token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.cookie("jwt-linkedin", Token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal error while user  logging ${error.message}` });
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt-linkedin");
  res.send("successfully logged out");
};

export const getUser = (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    return res.status(500).json({ message: "Internal error" });
  }
};
