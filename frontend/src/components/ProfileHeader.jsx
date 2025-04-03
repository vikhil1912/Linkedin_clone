import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { Camera, Clock, MapPin, UserCheck, UserPlus, X } from "lucide-react";
import avatar from "../assets/avatar.png";
import banner from "../assets/banner.png";
import { Dot } from "lucide-react";

const ProfileHeader = ({ userData, isOwnProfile }) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [bannerImg, setBannerImg] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState(null);
  var [profilepicture, setprofilepicture] = useState(null);
  const authuser = queryClient.getQueryData(["authuser"]);
  const { data: connectionStatus, isLoading } = useQuery({
    queryKey: ["connectionstatus", userData._id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/connection/status/${userData._id}`);
      return res.data;
    },
  });
  const { mutate: updateProfile } = useMutation({
    mutationFn: async (data) => {
      await axiosInstance.post("/user/updateprofile", data, {
        headers: { "Content-Type": "application/json" },
      });
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
  const { mutate: sendConnectionRequest, isPending: isSendingRequest } =
    useMutation({
      mutationFn: async () => {
        const res = await axiosInstance.post(
          `/connection/request/${userData._id}`
        );
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["suggestions"] });
        queryClient.invalidateQueries({
          queryKey: ["connectionstatus", userData._id],
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
        const res = await axiosInstance.put(
          `/connection/accept/${userData._id}`
        );
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["authuser"] });
        queryClient.invalidateQueries({ queryKey: ["suggestions"] });
        queryClient.invalidateQueries({ queryKey: ["connections"] });
        queryClient.invalidateQueries({
          queryKey: ["connectionstatus", userData._id],
        });
        toast.success("Request accepted");
      },
    });
  const { mutate: rejectConnectionRequest, isPending: isRejecting } =
    useMutation({
      mutationFn: async () => {
        const res = await axiosInstance.put(
          `/connection/reject/${userData._id}`
        );
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["authuser"] });
        queryClient.invalidateQueries({ queryKey: ["suggestions"] });
        queryClient.invalidateQueries({ queryKey: ["connections"] });
        queryClient.invalidateQueries({
          queryKey: ["connectionstatus", userData._id],
        });
        toast.success("Request rejected");
      },
    });
  const { mutate: removeConnection } = useMutation({
    mutationFn: async () =>
      await axiosInstance.delete(`/connection/${userData._id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authuser"] });
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      queryClient.invalidateQueries({
        queryKey: ["connectionstatus", userData._id],
      });
      toast.success("Connection removed");
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    },
  });
  const handleRemoveConnection = () => {
    if (!window.confirm("Do you want to remove connection")) return null;
    removeConnection();
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
    console.log(connectionStatus.status);

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
      case "connected":
        return (
          <button
            className="px-3 py-1 rounded-full text-sm bg-yellow-500 text-white flex items-center"
            onClick={handleRemoveConnection}
          >
            <Clock size={16} className="mr-1" />
            Remove connection
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
            onClick={sendConnectionRequest}
          >
            <UserPlus size={16} className="mr-1" />
            Connect
          </button>
        );
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      readFileAsDataURL(file).then((data) => {
        if (e.target.name === "profilepicture") {
          setprofilepicture(data);
          setProfileImagePreview(data);
        } else {
          setBannerImg(data);
          setBannerImagePreview(data);
        }
      });
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
  const handleSave = () => {
    updateProfile({ ...editedData, profilepicture, bannerimage: bannerImg });
    setIsEditing(false);
  };

  return (
    <div className="bg-white  shadow rounded-lg mb-6">
      <div
        className="relative h-48 rounded-t-lg bg-cover bg-center"
        style={{
          backgroundImage: `url('${
            bannerImagePreview || userData.bannerimage || banner
          }')`,
        }}
      >
        {isEditing && (
          <Dot
            onClick={() => {
              setIsEditing(false);
              setEditedData({});
            }}
            className="absolute text-red-700 size-20 -top-6 -left-5 hover:cursor-pointer z-10"
          />
        )}
        {isEditing && (
          <label className="absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer">
            <Camera className="text-Neutral" size={20} />
            <input
              type="file"
              className="hidden"
              name="bannerImg"
              onChange={handleImageChange}
              accept="image/*"
            />
          </label>
        )}
      </div>
      <div className="p-4">
        <div className="relative -mt-20 mb-4">
          <img
            className="w-32 h-32 rounded-full mx-auto object-cover"
            src={profileImagePreview || userData.profilepicture || avatar}
            alt={userData.name}
          />

          {isEditing && (
            <label className="absolute bottom-0 right-1/2 transform translate-x-16 bg-white p-2 rounded-full shadow cursor-pointer">
              <Camera className="text-Neutral" size={20} />
              <input
                type="file"
                className="hidden"
                name="profilepicture"
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>
          )}
        </div>
        <div className="text-center mb-4">
          {isEditing ? (
            <input
              type="text"
              value={editedData.name ?? userData.name}
              onChange={(e) => {
                setEditedData({ ...editedData, name: e.target.value });
              }}
              className="text-2xl text-Neutral font-bold mb-2 text-center w-full"
            />
          ) : (
            <h1 className="text-2xl text-Neutral font-bold mb-2">
              {userData.name}
            </h1>
          )}

          {isEditing ? (
            <input
              type="text"
              value={editedData.headline ?? userData.headline}
              onChange={(e) =>
                setEditedData({ ...editedData, headline: e.target.value })
              }
              className="text-gray-600 text-center w-full"
            />
          ) : (
            <p className="text-gray-600">{userData.headline}</p>
          )}
          <div className="flex justify-center items-center mt-2">
            <MapPin size={16} className="text-gray-500 mr-1" />
            {isEditing ? (
              <input
                type="text"
                value={editedData.location ?? userData.location}
                onChange={(e) =>
                  setEditedData({ ...editedData, location: e.target.value })
                }
                className="text-gray-600 text-center"
              />
            ) : (
              <span className="text-gray-600">{userData.location}</span>
            )}
          </div>
        </div>
        {isOwnProfile ? (
          isEditing ? (
            <button
              className="w-full bg-Primary text-white py-2 px-4 rounded-full hover:bg-Primary-dark
							 transition duration-300"
              onClick={handleSave}
            >
              Save Profile
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-Primary text-white py-2 px-4 rounded-full hover:bg-Primary-dark
							 transition duration-300"
            >
              Edit Profile
            </button>
          )
        ) : (
          <div className="flex justify-center">{renderFn()}</div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
