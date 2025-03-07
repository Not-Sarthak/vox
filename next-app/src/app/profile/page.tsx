"use client";

import React from "react";
import { Navbar } from "../../components/navbar/navbar";
import FullFooterWithBanner from "../../components/footer/full-footer";
import { useQuery } from "@tanstack/react-query";

const ProfilePage: React.FC = () => {
  const { data: requests } = useQuery({
    queryKey: ["activeBids"],
  });

  console.log("requests", requests);

  return (
    <div className="flex flex-col min-h-screen container mx-auto max-w-6xl font-bricolage">
      <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-20">
        <Navbar />
      </div>
      
      <div className="flex-grow max-w-5xl flex flex-col mx-auto pt-20 items-center md:items-start pb-8">
        <h1 className="text-2xl font-bold mb-4">Your Requests</h1>
        {/* Content goes here */}
      </div>

      <div className="mt-auto">
        <FullFooterWithBanner />
      </div>
    </div>
  );
};

export default ProfilePage;
