import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/login", data);
    },
    onSuccess: () => {
      toast.success("User Logged in");
      queryClient.invalidateQueries({ queryKey: ["authuser"] });
    },
    onError: (err) => toast.error(err.response.data.message),
  });
  const handleOnSubmit = (e) => {
    e.preventDefault();
    loginMutate({ email, password });
  };
  return (
    <form
      className="w-[350px] sm:w-full flex flex-col items-center gap-3 py-4 h-[250px] mt-[40px] bg-Secondary "
      onSubmit={handleOnSubmit}
    >
      <input
        type="email"
        placeholder="email"
        name="name"
        required
        onChange={(e) => setEmail(e.target.value)}
        className="input input-bordered w-[90%] bg-gray-100 text-black font-medium focus:outline-black flex items-center"
      />
      <input
        type="password"
        placeholder="password"
        name="name"
        required
        onChange={(e) => setPassword(e.target.value)}
        className="input input-bordered w-[90%] bg-gray-100 text-black font-medium focus:outline-black flex items-center"
      />
      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary w-[90%] text-white"
      >
        {isPending ? <Loader className="size-5 animate-spin" /> : "Login"}
      </button>
      <span className="text-Info text-[12px]">New to Linkedin?</span>
      <button
        type="button"
        onClick={() => navigate("/signup")}
        className="btn btn-neutral border-0 bg-Secondary w-[90%] text-Primary"
      >
        Sign up
      </button>
    </form>
  );
};

export default LoginForm;
