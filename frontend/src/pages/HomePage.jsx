import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar.jsx";
import { User } from "lucide-react";
import PostCreation from "../components/PostCreation.jsx";
import { Users } from "lucide-react";
import Post from "../components/Post.jsx";
import RecommendedUser from "../components/RecommendedUser.jsx";

const HomePage = () => {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authuser"]);

  const { data: suggestions } = useQuery({
    queryKey: ["suggestions"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/user/suggestions");
        return res.data;
      } catch (error) {
        return null;
      }
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/post");
        return res.data;
      } catch (error) {
        return null;
      }
    },
  });

  return (
    <div className="bg-gray-100 h-[727px] p-5 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="hidden lg:block col-span-1">
        <Sidebar user={authUser} />
      </div>
      <div className="col-span-1 overflow-y-scroll lg:col-span-2">
        <PostCreation user={authUser} />
        {posts?.map((post) => (
          <Post key={post._id} post={post} />
        ))}
        {posts?.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mb-6">
              <Users size={64} className="mx-auto text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              No Posts Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Connect with others to start seeing posts in your feed!
            </p>
          </div>
        )}
      </div>
      {suggestions?.length > 0 && (
        <div className="col-span-1 lg:col-span-1 hidden lg:block">
          <div className="bg-Secondary rounded-lg shadow p-4">
            <h2 className="font-semibold text-Neutral mb-4">
              People you may know
            </h2>
            {suggestions?.map((user) => (
              <RecommendedUser key={user._id} user={user} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
