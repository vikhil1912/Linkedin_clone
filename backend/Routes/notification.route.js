import express from "express";
import { protectRoute } from "../Middleware/auth.middleware.js";
import {
  getUserNotifications,
  markNotificationRead,
  deleteNotification,
} from "../Controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUserNotifications);
router.put("/:id/read", protectRoute, markNotificationRead);
router.delete("/:id/delete", protectRoute, deleteNotification);

export default router;
