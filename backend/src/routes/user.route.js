import express from "express";
import {
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  cancelFriendRequest,
  getFriendRequests,
  getFriends,
  rejectFriendRequest,
  unfriendUser,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/search", protectRoute, searchUsers);
router.get("/requests", protectRoute, getFriendRequests);
router.get("/friends", protectRoute, getFriends);

router.post("/request/unfriend", protectRoute, unfriendUser);
router.post("/request/send", protectRoute, sendFriendRequest);
router.post("/request/accept", protectRoute, acceptFriendRequest);
router.post("/request/cancel", protectRoute, cancelFriendRequest);
router.post("/request/reject", protectRoute, rejectFriendRequest);

export default router;
