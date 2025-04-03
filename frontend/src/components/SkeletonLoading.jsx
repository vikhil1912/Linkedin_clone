import React from "react";

const SkeletonLoading = () => {
  return (
    <div className="flex items-center justify-evenly min-h-screen">
      <div className="skeleton  h-[700px] w-[250px]"></div>
      <div className="flex flex-col gap-5 items-start">
        <div className="skeleton h-[550px] w-[700px]"></div>
        <div className="skeleton h-[120px] w-[700px]"></div>
      </div>
      <div className="skeleton  h-[700px] w-[250px]"></div>
    </div>
  );
};

export default SkeletonLoading;
