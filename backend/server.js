import express from "express";
import dotenv from "dotenv";
import authRoutes from "./Routes/auth.route.js";
import connectDb from "./lib/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./Routes/user.route.js";
import postRoutes from "./Routes/post.route.js";
import notificationRoutes from "./Routes/notification.route.js";
import connectionRoutes from "./Routes/connection.route.js";
import cors from "cors";
import path from "path";

dotenv.config();
const _dirname = path.resolve();
const server = express();
server.use(express.json({ limit: "10mb" }));
server.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  server.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true, //allows frontend to send cookies through req
    })
  );
}
server.use("/api/v1/auth", authRoutes);
server.use("/api/v1/user", userRoutes);
server.use("/api/v1/post", postRoutes);
server.use("/api/v1/notification", notificationRoutes);
server.use("/api/v1/connection", connectionRoutes);

if (process.env.NODE_ENV === "production") {
  server.use(express.static(path.join(_dirname, "/frontend/dist")));
  server.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
  });
}

server.listen(process.env.PORT || 5000, () => {
  console.log(`server is running in ${5000}`);
  connectDb();
});
