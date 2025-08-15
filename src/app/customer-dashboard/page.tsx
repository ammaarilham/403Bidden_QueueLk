"use client";

import Navbar from "@/components/shared/Navbar";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineArrowRight, AiOutlineClockCircle } from "react-icons/ai";
import { useRouter } from "next/navigation";

interface Booking {
  booking_number: number;
  item_name: string;
  booking_date: string;
  created_at: string;
  office?: string; // optional, if you want to display location
}

const Page = () => {
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  const router = useRouter();

  useEffect(() => {
    // Fetch recent bookings (latest 3)
    fetch("http://localhost:5000/api/fetch-bookings?limit=3", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setRecentBookings(data.bookings || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen w-full flex-col px-4 pt-20">
        <div className="flex gap-4">
          <a href="/customer-dashboard/bookings">
            <motion.img
              src="/assets/images/customer-dashboard/queue-booking.png"
              alt="Booking Image"
              className="w-full cursor-pointer rounded-xl"
            />
          </a>
          <a href="/customer-dashboard/inquiries">
            <motion.img
              src="/assets/images/customer-dashboard/inquiries.png"
              alt="Inquiries Image"
              className="w-full cursor-pointer rounded-xl"
            />
          </a>
        </div>
        <div className="mt-4">
          <motion.img
            src="/assets/images/customer-dashboard/support.png"
            alt="Support"
            className="w-full cursor-pointer rounded-xl"
          />
        </div>

        <div className="">
          <h2 className="mb-6 mt-10 text-2xl font-bold">Recent Bookings</h2>

          {recentBookings.length === 0 ? (
            <p className="text-gray-500">No recent bookings found.</p>
          ) : (
            recentBookings.map((b) => (
              <div key={b.booking_number}>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">
                      Booking #: {b.booking_number}
                    </span>
                    <h3 className="text-lg font-semibold">{b.item_name}</h3>
                    <p className="text-sm text-gray-500">
                      Booking Date: {b.booking_date}
                    </p>
                    {b.office && (
                      <p className="text-sm text-gray-400">{b.office}</p>
                    )}
                  </div>
                  <AiOutlineClockCircle size={28} className="text-gray-400" />
                </div>
                <hr className="my-4" />
              </div>
            ))
          )}

          <button
            onClick={() => router.push("/customer-dashboard/bookings")}
            className="mx-auto mt-4 flex items-center gap-2 rounded-md bg-gray-200 px-4 py-2"
          >
            <span>See all bookings</span>
            <AiOutlineArrowRight size={18} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Page;
