import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import avatar from "../assets/avatar.png";
import { Image, Loader } from "lucide-react";

const PostCreation = ({ user }) => {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/post/create", data, {
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post created successfully");
    },
    onError: () => {
      toast.error(error.response.data.message || "Failed to create post");
    },
  });

  const handlePostCreation = () => {
    try {
      const postData = { content: content };
      if (image) postData.image = imagePreview;
      createPost(postData);
    } catch (error) {
      console.log("Error while creating post", error.message);
    }
  };

  const resetForm = () => {
    setContent("");
    setImage(null);
    setImagePreview(null);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      readFileAsDataURL(file).then((data) => setImagePreview(data));
    } else {
      setImagePreview(null);
    }
  };
  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  return (
    <div className="bg-Secondary rounded-lg mb-4 p-4">
      <div className="flex">
        <img
          src={user.profilepicture || avatar}
          alt=""
          className="size-12 rounded-full mr-1"
        />
        <textarea
          placeholder="What's on your mind?"
          className="w-full p-3 rounded-lg text-black bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none resize-none transition-colors duration-200 min-h-[100px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      {imagePreview && (
        <div className="mt-4">
          <img
            src={imagePreview}
            alt="Selected"
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}
      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-4">
          <label className="flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer">
            <Image size={20} className="mr-2" />
            <span>Photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <button
          className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors duration-200"
          onClick={handlePostCreation}
          disabled={isPending}
        >
          {isPending ? <Loader className="size-5 animate-spin" /> : "Share"}
        </button>
      </div>
    </div>
  );
};

export default PostCreation;
