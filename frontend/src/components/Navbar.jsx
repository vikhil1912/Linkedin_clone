import React, { use } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { FiHome } from "react-icons/fi";
import { MdPeopleOutline } from "react-icons/md";
import small_logo from "../assets/small-logo.png";
import { FaRegBell } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const authuser = queryClient.getQueryData(["authuser"]);
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => await axiosInstance.get("/notification/"),
    enabled: !!authuser,
  });
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      await axiosInstance.get("/auth/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authuser"] });
      toast.success("Logged out successfully");
      console.log("logged out");
      navigate("/login");
    },
  });
  const { data: connectionRequest } = useQuery({
    queryKey: ["connectionRequest"],
    queryFn: async (req, res) => {
      return await axiosInstance.get("/connection/requests");
    },
    enabled: !!authuser,
  });
  const notificationCt = notifications?.data?.filter(
    (notif) => !notif.read
  ).length;
  const connectionCt = connectionRequest?.data.length;
  return (
    <nav className="h-[50px] w-full z-100 shadow-md sticky top-0 bg-Secondary flex items-center justify-between">
      <img
        onClick={() => navigate("/")}
        className="h-[80%] ml-2 p-[3px] rounded-[7px] hover:cursor-pointer"
        src={small_logo}
        alt=""
      />
      <div className="h-[50px] w-[400px] flex items-center justify-evenly">
        <Link to="/">
          <FiHome className="text-black text-2xl hover:cursor-pointer" />
        </Link>
        <div className="relative w-[45px]">
          <Link to="/network">
            <MdPeopleOutline className="text-Neutral text-3xl hover:cursor-pointer" />
          </Link>
          <span
            hidden={!connectionCt}
            className="absolute text-Secondary text-[12px] top-0 right-1.5 z-1 text-center bg-Primary w-[18px] h-[18px] rounded-3xl"
          >
            {connectionCt}
          </span>
        </div>
        <div className="relative w-[35px] hover:cursor-pointer">
          <Link to="/notifications">
            <FaRegBell className="text-Neutral text-2xl font-bold" />
          </Link>
          <span
            hidden={!notificationCt}
            className="absolute text-Secondary text-[12px] top-0 right-1 z-1 text-center bg-Primary w-[18px] h-[18px] rounded-3xl"
          >
            {notificationCt}
          </span>
        </div>
        <Link to={`/profile/${authuser.username}`}>
          <FaRegUser className="text-Neutral text-2xl hover:cursor-pointer" />
        </Link>
        <button
          onClick={() => logout()}
          className="flex items-center hover:cursor-pointer"
        >
          <FiLogOut className="mr-1 text-Neutral text-2xl" />
          <span className="text-neutral">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
