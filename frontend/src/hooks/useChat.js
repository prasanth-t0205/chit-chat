import { useEffect, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "./useAuth";

export function useChat() {
  const queryClient = useQueryClient();
  const { getSocket } = useAuth();
  const socket = getSocket();

  const { data: selectedUser } = useQuery({
    queryKey: ["selectedUser"],
    enabled: false,
    initialData: null,
  });

  const { data: users = [], isLoading: isUsersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => axiosInstance.get("/messages/users").then((res) => res.data),
  });

  const { data: messages = [], isLoading: isMessagesLoading } = useQuery({
    queryKey: ["messages", selectedUser?._id],
    queryFn: () =>
      selectedUser?._id
        ? axiosInstance
            .get(`/messages/${selectedUser._id}`)
            .then((res) => res.data)
        : [],
    enabled: !!selectedUser?._id,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData) => {
      const response = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      if (socket) {
        socket.emit("sendMessage", {
          ...response.data,
          receiverId: selectedUser._id,
        });
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["messages", selectedUser._id], (old = []) => [
        ...old,
        data,
      ]);
    },
  });

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      queryClient.setQueryData(
        ["messages", selectedUser?._id],
        (oldMessages = []) => {
          const messageExists = oldMessages.some(
            (msg) => msg._id === newMessage._id
          );
          if (messageExists) return oldMessages;

          return [...oldMessages, newMessage];
        }
      );
    };

    socket.on("receiveMessage", handleNewMessage);
    socket.on("messageSent", handleNewMessage);

    return () => {
      socket.off("receiveMessage");
      socket.off("messageSent");
    };
  }, [socket, selectedUser, queryClient]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageDeleted = (messageId) => {
      queryClient.setQueryData(
        ["messages", selectedUser?._id],
        (oldMessages = []) => {
          return oldMessages.filter((msg) => msg._id !== messageId);
        }
      );
    };

    socket.on("messageDeleted", handleMessageDeleted);

    return () => {
      socket.off("messageDeleted");
    };
  }, [socket, selectedUser, queryClient]);

  useEffect(() => {
    if (!socket) return;

    const handleUnfriend = () => {
      queryClient.setQueryData(["selectedUser"], null);
      queryClient.invalidateQueries(["messages"]);
    };

    socket.on("userUnfriended", handleUnfriend);

    return () => {
      socket.off("userUnfriended");
    };
  }, [socket, queryClient]);

  return {
    users,
    messages,
    selectedUser,
    setSelectedUser: useCallback(
      (user) => queryClient.setQueryData(["selectedUser"], user),
      [queryClient]
    ),
    isUsersLoading,
    isMessagesLoading,
    sendMessage: sendMessageMutation.mutate,
  };
}
