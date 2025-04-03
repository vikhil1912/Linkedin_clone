import React from "react";
import { useParams } from "react-router-dom";
import Post from "./Post.jsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "./Sidebar.jsx";

const PostPage = () => {
  const { postId } = useParams();
  const queryClient = useQueryClient();
  const authuser = queryClient.getQueryData(["authuser"]);
  const { data: post, isLoading } = useQuery({
    queryKey: ["postData"],
    queryFn: async () => await axiosInstance.get(`/post/${postId}`),
  });
  if (isLoading) return <div>Loading post...</div>;
  if (!post?.data) return <div>Post not found</div>;
  return (
    <div className="grid p-8 bg-gray-100 h-[727px] grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authuser} />
      </div>

      <div className="col-span-1 overflow-y-auto h-[690px] lg:col-span-2">
        <Post post={post.data} />
      </div>
    </div>
  );
};

export default PostPage;
