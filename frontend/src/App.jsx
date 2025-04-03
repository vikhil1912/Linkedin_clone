import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Notification from "./pages/Notification.jsx";
import Signup from "./pages/auth/Signup.jsx";
import Login from "./pages/auth/Login.jsx";
import Layout from "./components/Layout.jsx";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios.js";
import { Loader } from "lucide-react";
import SkeletonLoading from "./components/SkeletonLoading.jsx";
import Network from "./pages/Network.jsx";
import PostPage from "./components/PostPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authuser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          return null;
        }
        throw error;
      }
    },
  });

  return (
    <div className="bg-gray-100">
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={
              isLoading ? (
                <SkeletonLoading />
              ) : authUser ? (
                <>
                  <Layout>
                    <HomePage />
                  </Layout>
                </>
              ) : (
                <Navigate to={"/login"} />
              )
            }
          />
          <Route
            path="/login"
            element={!authUser ? <Login /> : <Navigate to={"/"} />}
          />
          <Route
            path="/signup"
            element={!authUser ? <Signup /> : <Navigate to={"/"} />}
          />
          <Route
            path="/notifications"
            element={
              isLoading ? (
                <SkeletonLoading />
              ) : authUser ? (
                <>
                  <Layout>
                    <Notification />
                  </Layout>
                </>
              ) : (
                <Navigate to={"/login"} />
              )
            }
          />
          <Route
            path="/network"
            element={
              isLoading ? (
                <SkeletonLoading />
              ) : authUser ? (
                <>
                  <Layout>
                    <Network />
                  </Layout>
                </>
              ) : (
                <Navigate to={"/login"} />
              )
            }
          />
          <Route
            path="/post/:postId"
            element={
              isLoading ? (
                <SkeletonLoading />
              ) : authUser ? (
                <>
                  <Layout>
                    <PostPage />
                  </Layout>
                </>
              ) : (
                <Navigate to={"/login"} />
              )
            }
          />
          <Route
            path="/profile/:username"
            element={
              isLoading ? (
                <SkeletonLoading />
              ) : authUser ? (
                <>
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </>
              ) : (
                <Navigate to={"/login"} />
              )
            }
          />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
};

export default App;
