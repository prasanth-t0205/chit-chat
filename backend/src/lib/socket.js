import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
    credentials: true,
  },
});

const userSocketMap = {};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("userOnline", () => {
    if (userId) {
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });

  socket.on("sendMessage", (message) => {
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", message);
      socket.emit("messageSent", message);
    }
  });

  socket.on("deleteMessage", (messageId) => {
    const receiverSocketId = getReceiverSocketId(messageId.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", messageId);
    }
  });

  socket.on("sendFriendRequest", (data) => {
    const receiverSocketId = getReceiverSocketId(data.targetUserId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("friendRequestReceived", data);
    }
    socket.emit("friendRequestReceived", data);
  });

  socket.on("acceptFriendRequest", (data) => {
    const receiverSocketId = getReceiverSocketId(data.requesterId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("friendRequestAccepted", data);
    }
    socket.emit("friendRequestAccepted", data);
  });

  socket.on("cancelFriendRequest", (data) => {
    const receiverSocketId = getReceiverSocketId(data.targetUserId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("friendRequestCancelled", data);
    }
    socket.emit("friendRequestCancelled", data);
  });

  socket.on("rejectFriendRequest", (data) => {
    const receiverSocketId = getReceiverSocketId(data.requesterId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("friendRequestRejected", data);
    }
    socket.emit("friendRequestRejected", data);
  });

  socket.on("unfriendUser", (data) => {
    const receiverSocketId = getReceiverSocketId(data.friendId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userUnfriended", data);
    }
    socket.emit("userUnfriended", data);
  });

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { io, server, app };
