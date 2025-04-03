import React from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import ProfileHeader from "../components/ProfileHeader.jsx";
import AboutSection from "../components/AboutSection.jsx";
import ExperienceSection from "../components/ExperienceSection.jsx";
import EducationSection from "../components/EducationSection.jsx";
import SkillsSection from "../components/SkillsSection.jsx";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const { username } = useParams();
  const authuser = queryClient.getQueryData(["authuser"]);

  const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => await axiosInstance.get(`/user/${username}`),
  });
  const isOwnProfile = authuser.username === username;
  const userData = isOwnProfile ? authuser : userProfile?.data;
  if (!authuser || isUserProfileLoading) return null;
  return (
    <div className="max-w-4xl min-h-screen  mx-auto p-4">
      <ProfileHeader userData={userData} isOwnProfile={isOwnProfile} />
      <AboutSection userData={userData} isOwnProfile={isOwnProfile} />
      <ExperienceSection userData={userData} isOwnProfile={isOwnProfile} />
      {/*<EducationSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />
      <SkillsSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      /> */}
    </div>
  );
};

export default ProfilePage;
