import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { Link } from "react-router-dom";
import avatar from "../assets/avatar.png";
import toast from "react-hot-toast";

const FriendRequest = ({ request }) => {
  const queryClient = useQueryClient();
  const { mutate: acceptConnectionRequest, isPending: isAccepting } =
    useMutation({
      mutationFn: async (id) => {
        const res = await axiosInstance.put(`/connection/accept/${id}`);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["authuser"] });
        queryClient.invalidateQueries({ queryKey: ["suggestions"] });
        queryClient.invalidateQueries({ queryKey: ["connections"] });
        queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
        queryClient.invalidateQueries({ queryKey: ["connectionRequest"] });
        queryClient.invalidateQueries({
          queryKey: ["connectionstatus", user._id],
        });
        toast.success("Request accepted");
      },
    });
  const { mutate: rejectConnectionRequest, isPending: isRejecting } =
    useMutation({
      mutationFn: async (id) => {
        const res = await axiosInstance.put(`/connection/reject/${id}`);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["authuser"] });
        queryClient.invalidateQueries({ queryKey: ["suggestions"] });
        queryClient.invalidateQueries({ queryKey: ["connections"] });
        queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
        queryClient.invalidateQueries({ queryKey: ["connectionRequest"] });
        queryClient.invalidateQueries({
          queryKey: ["connectionstatus", user._id],
        });
        toast.success("Request rejected");
      },
    });
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <Link to={`/profile/${request.sender.username}`}>
          <img
            src={request.sender.profilepicture || avatar}
            alt={request.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        </Link>

        <div>
          <Link
            to={`/profile/${request.sender.username}`}
            className="font-semibold text-lg"
          >
            <span className="text-Neutral">{request.sender.name}</span>
          </Link>
          <p className="text-gray-600">{request.sender.headline}</p>
        </div>
      </div>

      <div className="space-x-2">
        <button
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
          onClick={() => acceptConnectionRequest(request.sender._id)}
        >
          Accept
        </button>
        <button
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          onClick={() => rejectConnectionRequest(request.sender._id)}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default FriendRequest;
