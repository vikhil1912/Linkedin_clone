import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const SignupForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();

  const { mutate: signUpMutation, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/signup", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authuser"] });
      toast.success("Account created successfully");
    },
    onError: (error) => toast.error(error.response.data.message),
  });

  const handleOnSubmit = (e) => {
    e.preventDefault();
    signUpMutation({ name, username, email, password });
  };
  return (
    <form
      className="min-w-[350px] sm:w-full flex flex-col items-center gap-3 py-4 h-[500px] mt-[40px] bg-Secondary "
      onSubmit={handleOnSubmit}
    >
      <input
        type="text"
        placeholder="Full name"
        name="name"
        required
        onChange={(e) => setName(e.target.value)}
        className="input input-bordered w-[90%] bg-gray-100  text-black font-medium focus:outline-black flex items-center"
      />
      <input
        type="text"
        placeholder="username"
        name="name"
        required
        onChange={(e) => setUserName(e.target.value)}
        className="input input-bordered w-[90%] bg-gray-100 text-black font-medium focus:outline-black flex items-center"
      />
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
        placeholder="password (6+characters)"
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
        {isPending ? (
          <Loader className="size-5 animate-spin" />
        ) : (
          "Agree & Join"
        )}
      </button>
      <span className="text-Info text-[12px]">Already on Linkedin?</span>
      <button
        onClick={() => navigate("/login")}
        className="btn btn-neutral border-0 bg-Secondary w-[90%] text-Primary"
      >
        Sign in
      </button>
    </form>
  );
};

export default SignupForm;
