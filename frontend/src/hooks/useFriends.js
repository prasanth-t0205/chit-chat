import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "./useAuth";
import { useEffect } from "react";

export const useFriends = () => {
  const queryClient = useQueryClient();
  const { getSocket } = useAuth();
  const socket = getSocket();

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users/friends");
      return data;
    },
  });

  useEffect(() => {
    if (!socket) return;

    const handleFriendUpdate = () => {
      queryClient.invalidateQueries(["friends"]);
    };

    socket.on("friendRequestAccepted", handleFriendUpdate);
    socket.on("userUnfriended", handleFriendUpdate);

    return () => {
      socket.off("friendRequestAccepted");
      socket.off("userUnfriended");
    };
  }, [socket, queryClient]);

  return { friends, isLoading };
};
