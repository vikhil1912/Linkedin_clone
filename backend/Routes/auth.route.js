import express from "express";
import { protectRoute } from "../Middleware/auth.middleware.js";
import { signup, login, logout } from "../Controllers/auth.controller.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json(req.user);
});

export default router;
