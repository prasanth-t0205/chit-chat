import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToCharId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: userToCharId },
        { senderId: userToCharId, receiverId: senderId },
      ],
      deletedFor: { $ne: senderId },
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    const savedMessage = await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", savedMessage);
    }

    res.status(201).json(savedMessage);
  } catch (error) {
    console.log("Error in sendMessage: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInUserId = req.user._id;
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    if (message.senderId.toString() !== loggedInUserId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (message.image) {
      const publicId = message.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }
    await Message.findByIdAndDelete(id);

    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", id);
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log("Error in deleteMessage: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAllMessages = async (req, res) => {
  try {
    const { id: otherUserId } = req.params;
    const loggedInUserId = req.user._id;

    await Message.updateMany(
      {
        $or: [
          { senderId: loggedInUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: loggedInUserId },
        ],
      },
      {
        $addToSet: { deletedFor: loggedInUserId },
      }
    );

    const messagesToDelete = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: loggedInUserId },
      ],
      deletedFor: { $all: [loggedInUserId, otherUserId] },
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
        { senderId: loggedInUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: loggedInUserId },
      ],
      deletedFor: { $all: [loggedInUserId, otherUserId] },
    });

    res.status(200).json({ message: "All messages deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAllMessages: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchMessages = async (req, res) => {
  const { id } = req.params;
  const { query } = req.query;

  try {
    const messages = await Message.find({
      $and: [
        {
          $or: [
            { senderId: req.user._id, receiverId: id },
            { senderId: id, receiverId: req.user._id },
          ],
        },
        {
          text: { $regex: query, $options: "i" },
        },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
