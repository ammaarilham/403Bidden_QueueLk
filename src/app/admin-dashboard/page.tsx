"use client";

import Navbar from "@/components/shared/Navbar";
import React from "react";
import { motion } from "framer-motion";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { AiOutlineClockCircle } from "react-icons/ai";

const Page = () => {
  return (
    <>
      {/* <Navbar /> */}
      <div className="flex min-h-screen w-full flex-col px-4 pt-20">
        <div className="flex h-auto w-full flex-col gap-4">
          <div className="flex gap-4">
            <a href="/admin-dashboard/institutions">
              <motion.img
                src="/assets/images/admin-dashboard/institutions.png"
                alt="Booking Image"
                className="w-full cursor-pointer rounded-xl"
              />
            </a>
            <a href="/admin-dashboard/events">
              <motion.img
                src="/assets/images/admin-dashboard/add-event.png"
                alt="Inquiries Image"
                className="w-full cursor-pointer rounded-xl"
              />
            </a>
          </div>
          <div className="flex gap-4">
            <a href="/admin-dashboard/services">
              <motion.img
                src="/assets/images/admin-dashboard/add-service.png"
                alt="Booking Image"
                className="w-full cursor-pointer rounded-xl"
              />
            </a>
            <a href="/inquiries">
              <motion.img
                src="/assets/images/admin-dashboard/support.png"
                alt="Inquiries Image"
                className="w-full cursor-pointer rounded-xl"
              />
            </a>
          </div>
        </div>

        <div className="my-5">
          <p className="mb-6 text-sm text-gray-600">temporary buttons</p>
          <a
            href="/admin-dashboard/users"
            className="rounded-sm bg-black p-2 text-white"
          >
            Manage Users
          </a>
        </div>

        <p>
          Need like 2 graphs here and you have to create a button for the users
          too. just put it temporary here
        </p>
      </div>
    </>
  );
};

export default Page;
