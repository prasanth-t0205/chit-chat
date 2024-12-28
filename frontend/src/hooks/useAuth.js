import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

let socket = null;

export const useAuth = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({
        authUser: res.data,
        isCheckingAuth: false,
      });

      if (res.data?._id) get().connectSocket(res.data._id);
    } catch (error) {
      if (error.response?.status === 401) {
        set({
          authUser: null,
          isCheckingAuth: false,
        });
      }
    }
  },

  connectSocket: (userId) => {
    if (!userId || socket?.connected) return;

    socket = io(import.meta.env.VITE_SOCKET_URL, {
      query: { userId },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      socket.emit("userOnline");
    });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    socket.connect();
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      get().connectSocket(res.data._id);
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      get().connectSocket(res.data._id);
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null, onlineUsers: [] });
      if (socket?.connected) {
        socket.disconnect();
        socket = null;
      }
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({
        authUser: res.data,
        isUpdatingProfile: false,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      set({ isUpdatingProfile: false });
      toast.error(error.response?.data?.message || "Failed to update profile");
      throw error;
    }
  },

  getSocket: () => socket,
}));
