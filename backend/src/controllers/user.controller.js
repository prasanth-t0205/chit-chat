import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";

export const searchUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const userId = req.user._id;

    const currentUser = await User.findById(userId);

    const users = await User.find({
      $and: [
        { _id: { $ne: userId } },
        { _id: { $nin: currentUser.friends } },
        {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
      ],
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error searching users" });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const userId = req.user._id;

    const targetUser = await User.findById(targetUserId);
    const sourceUser = await User.findById(userId);

    if (!targetUser || !sourceUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser.friendRequests.includes(userId)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    targetUser.friendRequests.push(userId);
    sourceUser.sentRequests.push(targetUserId);

    await targetUser.save();
    await sourceUser.save();

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending friend request" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const userId = req.user._id;

    const requester = await User.findById(requesterId);
    const accepter = await User.findById(userId);

    if (!requester || !accepter) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add to friends list
    requester.friends.push(userId);
    accepter.friends.push(requesterId);

    // Remove from requests
    accepter.friendRequests = accepter.friendRequests.filter(
      (id) => id.toString() !== requesterId
    );
    requester.sentRequests = requester.sentRequests.filter(
      (id) => id.toString() !== userId.toString()
    );

    await requester.save();
    await accepter.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ message: "Error accepting friend request" });
  }
};

export const cancelFriendRequest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const userId = req.user._id;

    const targetUser = await User.findById(targetUserId);
    const sourceUser = await User.findById(userId);

    if (!targetUser || !sourceUser) {
      return res.status(404).json({ message: "User not found" });
    }

    targetUser.friendRequests = targetUser.friendRequests.filter(
      (id) => id.toString() !== userId.toString()
    );
    sourceUser.sentRequests = sourceUser.sentRequests.filter(
      (id) => id.toString() !== targetUserId.toString()
    );

    await targetUser.save();
    await sourceUser.save();

    res.status(200).json({ message: "Friend request cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling friend request" });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .populate("friendRequests sentRequests", "-password")
      .select("friendRequests sentRequests");

    res.status(200).json({
      receivedRequests: user.friendRequests,
      sentRequests: user.sentRequests,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching friend requests" });
  }
};

export const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .populate("friends", "fullName email profilePic")
      .select("friends");

    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ message: "Error fetching friends" });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const userId = req.user._id;

    const requester = await User.findById(requesterId);
    const rejecter = await User.findById(userId);

    if (!requester || !rejecter) {
      return res.status(404).json({ message: "User not found" });
    }

    rejecter.friendRequests = rejecter.friendRequests.filter(
      (id) => id.toString() !== requesterId
    );

    requester.sentRequests = requester.sentRequests.filter(
      (id) => id.toString() !== userId.toString()
    );

    await Promise.all([requester.save(), rejecter.save()]);

    res.status(200).json({
      message: "Friend request rejected",
      requester: requester._id,
      rejecter: rejecter._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting friend request" });
  }
};

export const unfriendUser = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found" });
    }
    const messagesToDelete = await Message.find({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
      image: { $ne: null },
    });

    for (const message of messagesToDelete) {
      if (message.image) {
        const publicId = message.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
    }
    await Message.deleteMany({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    });
    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    friend.friends = friend.friends.filter(
      (id) => id.toString() !== userId.toString()
    );

    await Promise.all([user.save(), friend.save()]);

    res.status(200).json({
      message: "Friend removed and all messages deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error removing friend" });
  }
};
