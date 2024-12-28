import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  deleteAllMessages,
  deleteMessage,
  getMessages,
  getUsersForSidebar,
  searchMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.get("/search/:id", protectRoute, searchMessages);

router.post("/send/:id", protectRoute, sendMessage);
router.delete("/:id", protectRoute, deleteMessage);
router.delete("/all/:id", protectRoute, deleteAllMessages);

export default router;
