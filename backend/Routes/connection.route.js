import express from "express";
import { protectRoute } from "../Middleware/auth.middleware.js";
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  generateAllConnectionRequests,
  getUserConnections,
  removeConnection,
  getConnectionStatus,
} from "../Controllers/connection.controller.js";

const router = express.Router();

router.post("/request/:userId", protectRoute, sendConnectionRequest);
router.put("/accept/:requestId", protectRoute, acceptConnectionRequest);
router.put("/reject/:requestId", protectRoute, rejectConnectionRequest);

//get all connection req for the current user
router.get("/requests", protectRoute, generateAllConnectionRequests);
//get all connections
router.get("/", protectRoute, getUserConnections);
router.delete("/:userId", protectRoute, removeConnection);
router.get("/status/:userId", protectRoute, getConnectionStatus);

export default router;
