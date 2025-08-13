"use client";

import Navbar from "@/components/shared/Navbar";
import React from "react";
import { motion } from "framer-motion";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { AiOutlineClockCircle } from "react-icons/ai";

const page = () => {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen w-full flex-col px-4 pt-20">
        <div className="flex h-auto w-full flex-col gap-4">
          <div className="flex gap-4">
            <a href="/booking">
              <motion.img
                src="/assets/images/customer-dashboard/queue-booking.png"
                alt="Booking Image"
                className="w-full cursor-pointer rounded-xl"
              />
            </a>
            <a href="/inquiries">
              <motion.img
                src="/assets/images/customer-dashboard/inquiries.png"
                alt="Inquiries Image"
                className="w-full cursor-pointer rounded-xl"
              />
            </a>
          </div>
          <div>
            <motion.img
              src="/assets/images/customer-dashboard/support.png"
              alt="Login Logo"
              className="w-full cursor-pointer rounded-xl"
            />
          </div>
        </div>

        <div className="relative mt-5 w-full">
          <input
            id="search"
            type="text"
            placeholder="Search for locations, services..."
            className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 pr-12 focus:outline-none focus:ring-2"
          />

          <AiOutlineArrowLeft
            size={33}
            className="cursor-pointerbg-primary bg-primary absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-white"
          />
        </div>
        <div className="px-5">
          <h2 className="mb-6 mt-10 text-2xl font-bold">Recent Activity</h2>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-lg">Gramasevaka Certificate</h3>
              <p className="text-sm text-gray-500">Dehiwala Office</p>
            </div>
            <div>
              <AiOutlineClockCircle size={28} className="" />
            </div>
          </div>
          <hr className="my-4" />
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-lg">Birth Certificate Renewal</h3>
              <p className="text-sm text-gray-500">Colombo Head Office</p>
            </div>
            <div>
              <AiOutlineClockCircle size={28} className="" />
            </div>
          </div>
          <hr className="my-4" />
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-lg">Passport Application</h3>
              <p className="text-sm text-gray-500">Koswaththa Head Office</p>
            </div>
            <div>
              <AiOutlineClockCircle size={28} className="" />
            </div>
          </div>
          <hr className="my-4" />

          <button className="mx-auto mt-4 flex items-center gap-2 rounded-md bg-gray-200 px-4 py-2">
            <span>See all activity</span>
            <AiOutlineArrowRight size={18} />
          </button>
        </div>
      </div>
    </>
  );
};

export default page;
