import React from "react";
import link_logo from "../../assets/linkedin_logo.svg";
import LoginForm from "../../components/LoginForm.jsx";

const Login = () => {
  return (
    <div className="bg-gray-100 min-h-screen w-full flex flex-col items-center justify-center">
      <div className=" sm:bg-gray-100 w-[410px] h-[570px] flex flex-col items-center gap-0">
        <img src={link_logo} className="w-[200px] " alt="" />
        <h1 className="sm:text-[25px] font-bold  text-center text-Neutral">
          Make the most of your proffesional life
        </h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
