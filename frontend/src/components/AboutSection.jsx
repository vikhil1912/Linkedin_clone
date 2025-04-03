import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { Dot } from "lucide-react";

const AboutSection = ({ userData, isOwnProfile }) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState(userData.about);
  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/user/updateprofile", data, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["authuser"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    },
  });
  const handleOnSave = () => {
    updateProfile({ about });
    setIsEditing(false);
  };
  return (
    <div className="bg-white shadow relative rounded-lg p-6 mb-6">
      {isEditing && (
        <Dot
          onClick={() => {
            setIsEditing(false);
            setAbout(userData.about);
          }}
          className="absolute text-red-700 size-20 -top-6 -left-5 hover:cursor-pointer z-10"
        />
      )}
      <h2 className="text-xl text-Neutral font-semibold mb-4">About</h2>
      {isOwnProfile && (
        <>
          {isEditing ? (
            <>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full  p-2 border border-Neutral bg-gray-100 text-black rounded"
                rows="4"
              />
              {isUpdating ? (
                <>
                  <button
                    onClick={handleOnSave}
                    className="mt-2 bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark hover:cursor-pointer
              transition duration-300"
                  >
                    <Loader className="size-5 animate-spin" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleOnSave}
                    className="mt-2 bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark hover:cursor-pointer
              transition duration-300"
                  >
                    Save
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <p className="text-Info">{userData.about}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-2 py-2 px-4 rounded  bg-Primary text-white hover:text-primary-dark hover:cursor-pointer transition duration-300"
              >
                Edit
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AboutSection;
