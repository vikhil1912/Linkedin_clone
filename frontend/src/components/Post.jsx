import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import avatar from "../assets/avatar.png";
import {
  Loader,
  MessageCircle,
  Send,
  Share2,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import PostAction from "./PostAction";

const Post = ({ post }) => {
  const queryClient = useQueryClient();
  const authuser = queryClient.getQueryData(["authuser"]);
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const isLiked = post.likes.includes(authuser._id);
  const isOwner = authuser._id.toString() === post.author._id.toString();

  const { mutate: deletePostMutation, isPending: isDeletingPost } = useMutation(
    {
      mutationFn: async () => {
        const res = await axiosInstance.delete(`/post/delete/${post._id}`);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Post deleted successfully");
      },
    }
  );
  const { mutate: createComment, isPending: isAddingComment } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post(`/post/${post._id}/comment`, {
        content: data,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("You commented on this post");
    },
  });
  const { mutate: likePost, isPending: isLikingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/post/${post._id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
  const handleDeletePost = () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    deletePostMutation();
  };
  const handleLikePost = async () => {
    if (isLikingPost) return;
    likePost();
  };
  const handleAddComments = async (e) => {
    e.preventDefault();
    setComment(comment.trim());
    if (comment) {
      createComment(comment);
      setComment("");
    }
  };
  // console.log(post.comments);

  return (
    <div>
      <div className="bg-Secondary rounded-lg shadow mb-4">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Link to={`/profile/${post?.author?.username}`}>
                <img
                  src={post.author.profilepicture || avatar}
                  alt={post.author.name}
                  className="size-10 rounded-full mr-3"
                />
              </Link>

              <div>
                <Link to={`/profile/${post?.author?.username}`}>
                  <h3 className="font-semibold text-neutral">
                    {post.author.name}
                  </h3>
                </Link>
                <p className="text-xs text-Info">{post.author.headline}</p>
                <p className="text-xs text-Info">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            {isOwner && (
              <button
                onClick={handleDeletePost}
                className="text-red-500 hover:text-red-700"
              >
                {isDeletingPost ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
              </button>
            )}
          </div>
          <p className="mb-4 text-gray-800">{post.content}</p>
          {post.image && (
            <img
              src={post.image}
              alt="Post content"
              className="rounded-lg w-full mb-4"
            />
          )}

          <div className="flex justify-between text-Info">
            <PostAction
              icon={
                <ThumbsUp
                  size={18}
                  className={isLiked ? "text-blue-500  fill-blue-300" : ""}
                />
              }
              text={`Like (${post.likes.length})`}
              onClick={handleLikePost}
            />

            <PostAction
              icon={<MessageCircle size={18} />}
              text={`Comment (${post.comments.length})`}
              onClick={() => setShowComments(!showComments)}
            />
            <PostAction icon={<Share2 size={18} />} text="Share" />
          </div>
        </div>

        {showComments && (
          <div className="px-4 pb-4">
            <div className="mb-4 max-h-60 overflow-y-auto">
              {post.comments.map((comment) => (
                <div
                  key={comment._id}
                  className="mb-2 bg-gray-100 p-2 rounded flex items-start "
                >
                  <img
                    src={comment.user.profilepicture || avatar}
                    alt={comment.user.name}
                    className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center mb-1">
                      <span className="font-semibold text-black mr-2">
                        {comment.user.name}
                      </span>
                      <span className="text-xs text-Info">
                        {formatDistanceToNow(new Date(comment.createdAt))}
                      </span>
                    </div>
                    <p className="text-Info">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComments} className="flex items-center">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-grow p-2 rounded-l-full text-Info bg-gray-100 focus:outline-none focus:ring-2 focus:ring-Primary"
              />

              <button
                type="submit"
                className="bg-Primary text-white p-2 rounded-r-full hover:bg-Primary-dark transition duration-300"
                disabled={isAddingComment}
              >
                {isAddingComment ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
