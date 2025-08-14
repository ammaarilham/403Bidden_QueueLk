"use client";
import React, { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import { TbLanguage } from "react-icons/tb";
import { HiOutlineLogout } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";

const Page = () => {
  const [success, setSuccess] = useState(false);

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen w-full flex-col items-center gap-10 px-4 pt-20">
        <div className="w-full max-w-md rounded-xl">
          {/* Title */}
          <h2 className="mb-8 text-2xl font-bold text-gray-900">
            Account Details
          </h2>

          {/* Stats */}
          <div className="flex divide-x divide-gray-300 overflow-hidden rounded-lg">
            <div className="flex-1 p-5 text-center">
              <h2 className="text-2xl font-bold text-gray-800">0</h2>
              <p className="text-primary mt-1 text-sm font-medium">
                Recent Activity
              </p>
            </div>
            <div className="flex-1 p-5 text-center">
              <h2 className="text-2xl font-bold text-gray-800">0</h2>
              <p className="text-primary mt-1 text-sm font-medium">Bookings</p>
            </div>
          </div>

          {/* Settings */}
          <div className="mt-10 space-y-1">
            {/* Language */}
            <div className="flex cursor-pointer items-center justify-between rounded-lg p-3 transition hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <TbLanguage size={28} className="text-gray-700" />
                <span className="font-medium text-gray-800">Language</span>
              </div>
              <IoIosArrowForward size={20} className="text-gray-400" />
            </div>

            <hr className="border-gray-200" />

            {/* Logout */}
            <div className="flex cursor-pointer items-center justify-between rounded-lg p-3 transition hover:bg-red-50">
              <div className="flex items-center gap-3">
                <HiOutlineLogout size={28} className="text-red-600" />
                <span className="font-medium text-red-600">Logout</span>
              </div>
              <IoIosArrowForward size={20} className="text-red-400" />
            </div>
            <hr className="border-gray-200" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
