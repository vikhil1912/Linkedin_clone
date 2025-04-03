import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Check, Clock, UserCheck, UserPlus, X } from "lucide-react";
import avatar from "../assets/avatar.png";

const RecommendedUser = ({ user }) => {
  const queryClient = useQueryClient();
  const authuser = queryClient.getQueryData(["authuser"]);
  const { data: connectionStatus, isLoading } = useQuery({
    queryKey: ["connectionstatus", user._id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/connection/status/${user._id}`);
      return res.data;
    },
  });
  //   const status = connectionStatus?.status;
  //   console.log(status);

  const { mutate: sendConnectionRequest, isPending: isSendingRequest } =
    useMutation({
      mutationFn: async () => {
        const res = await axiosInstance.post(`/connection/request/${user._id}`);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["suggestions"] });
        queryClient.invalidateQueries({
          queryKey: ["connectionstatus", user._id],
        });
        toast.success("Connection send successfully");
      },
      onError: (error) => {
        queryClient.invalidateQueries({ queryKey: ["suggestions"] });
        toast.error(error.response.data.message || "Something went wrong");
      },
    });
  const { mutate: acceptConnectionRequest, isPending: isAccepting } =
    useMutation({
      mutationFn: async () => {
        const res = await axiosInstance.put(`/connection/accept/${user._id}`);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["authuser"] });
        queryClient.invalidateQueries({ queryKey: ["suggestions"] });
        queryClient.invalidateQueries({ queryKey: ["connections"] });
        queryClient.invalidateQueries({ queryKey: ["connectionRequest"] });
        queryClient.invalidateQueries({
          queryKey: ["connectionstatus", user._id],
        });
        toast.success("Request accepted");
      },
    });
  const { mutate: rejectConnectionRequest, isPending: isRejecting } =
    useMutation({
      mutationFn: async () => {
        const res = await axiosInstance.put(`/connection/reject/${user._id}`);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["authuser"] });
        queryClient.invalidateQueries({ queryKey: ["suggestions"] });
        queryClient.invalidateQueries({ queryKey: ["connections"] });
        queryClient.invalidateQueries({ queryKey: ["connectionRequest"] });
        queryClient.invalidateQueries({
          queryKey: ["connectionstatus", user._id],
        });
        toast.success("Request rejected");
      },
    });
  const handleConnect = () => {
    if (connectionStatus?.status === "not_connected") {
      sendConnectionRequest();
    }
  };
  const renderFn = () => {
    if (isLoading) {
      return (
        <button
          className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-500"
          disabled
        >
          Loading...
        </button>
      );
    }
    switch (connectionStatus.status) {
      case "pending":
        return (
          <button
            className="px-3 py-1 rounded-full text-sm bg-yellow-500 text-white flex items-center"
            disabled
          >
            <Clock size={16} className="mr-1" />
            Pending
          </button>
        );
      case "recieved":
        return (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => acceptConnectionRequest()}
              className={`rounded-full p-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white`}
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => rejectConnectionRequest()}
              className={`rounded-full p-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white`}
            >
              <X size={16} />
            </button>
          </div>
        );
      default:
        return (
          <button
            className="px-3 py-1 rounded-full text-sm border border-Primary text-Primary hover:bg-Primary hover:text-white transition-colors duration-200 flex items-center"
            onClick={handleConnect}
          >
            <UserPlus size={16} className="mr-1" />
            Connect
          </button>
        );
    }
  };
  return (
    <div className="flex items-center justify-between mb-4">
      <Link
        to={`/profile/${user.username}`}
        className="flex items-center text-Neutral flex-grow"
      >
        <img
          src={user.profilepicture || avatar}
          alt={user.name}
          className="w-12 h-12 rounded-full mr-3"
        />
        <div>
          <h3 className="font-semibold text-sm">{user.name}</h3>
          <p className="text-xs text-Info">{user.headline}</p>
        </div>
      </Link>
      {renderFn()}
    </div>
  );
};

export default RecommendedUser;
