import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "./useAuth";
import { useEffect } from "react";

export const useSearch = () => {
  const queryClient = useQueryClient();
  const { getSocket } = useAuth();
  const socket = getSocket();

  const searchQuery = (searchTerm) =>
    useQuery({
      queryKey: ["users", searchTerm],
      queryFn: async () => {
        const { data } = await axiosInstance.get(
          `/users/search?search=${searchTerm}`
        );
        return data;
      },
    });

  const friendsQuery = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users/friends");
      return data;
    },
  });

  const friendRequestsQuery = useQuery({
    queryKey: ["friendRequests"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users/requests");
      return {
        receivedRequests: data.receivedRequests || [],
        sentRequests: data.sentRequests || [],
      };
    },
  });

  const friendRequestsMutation = useMutation({
    mutationFn: async (targetUserId) => {
      const { data } = await axiosInstance.post("/users/request/send", {
        targetUserId,
      });
      socket?.emit("sendFriendRequest", { targetUserId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["friendRequests"]);
    },
  });

  const acceptRequestMutation = useMutation({
    mutationFn: async (requesterId) => {
      const { data } = await axiosInstance.post("/users/request/accept", {
        requesterId,
      });
      socket?.emit("acceptFriendRequest", { requesterId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["friendRequests"]);
      queryClient.invalidateQueries(["friends"]);
    },
  });

  const cancelRequestMutation = useMutation({
    mutationFn: async (targetUserId) => {
      const { data } = await axiosInstance.post("/users/request/cancel", {
        targetUserId,
      });
      socket?.emit("cancelFriendRequest", { targetUserId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["friendRequests"]);
    },
  });

  const rejectRequestMutation = useMutation({
    mutationFn: async (requesterId) => {
      const { data } = await axiosInstance.post("/users/request/reject", {
        requesterId,
      });
      socket?.emit("rejectFriendRequest", { requesterId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["friendRequests"]);
    },
  });

  const unfriendMutation = useMutation({
    mutationFn: async (friendId) => {
      const { data } = await axiosInstance.post("/users/request/unfriend", {
        friendId,
      });
      socket?.emit("unfriendUser", { friendId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["friends"]);
      queryClient.invalidateQueries(["messages"]);
    },
  });

  useEffect(() => {
    if (!socket) return;

    const handlers = {
      friendRequestReceived: () =>
        queryClient.invalidateQueries(["friendRequests"]),
      friendRequestAccepted: () => {
        queryClient.invalidateQueries(["friendRequests"]);
        queryClient.invalidateQueries(["friends"]);
      },
      friendRequestCancelled: () =>
        queryClient.invalidateQueries(["friendRequests"]),
      friendRequestRejected: () =>
        queryClient.invalidateQueries(["friendRequests"]),
      userUnfriended: () => {
        queryClient.invalidateQueries(["friends"]);
        queryClient.invalidateQueries(["messages"]);
      },
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.keys(handlers).forEach((event) => {
        socket.off(event);
      });
    };
  }, [socket, queryClient]);

  return {
    searchQuery,
    friendRequestsMutation,
    cancelRequestMutation,
    acceptRequestMutation,
    rejectRequestMutation,
    friendRequestsQuery,
    friendsQuery,
    unfriendMutation,
  };
};
