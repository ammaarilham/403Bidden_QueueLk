"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import SuccessRedirectPage from "@/components/shared/SuccessRedirectPage";
import {
  FaUser,
  FaEnvelope,
  FaIdBadge,
  FaBuilding,
  FaPhoneAlt,
} from "react-icons/fa";

const Page = () => {
  const [success, setSuccess] = useState(false);

  const [users, setUsers] = useState<
    {
      id: number;
      username: string;
      full_name: string;
      official_title: string;
      employee_id: string;
      email: string; // backend calls it email
      mobile_number: string;
      alternative_contact?: string;
      registered_institution: string | number;
      institution_name?: string; // from join
      role?: number; // from type
    }[]
  >([]);

  // Fetch existing users
  useEffect(() => {
    fetch("http://localhost:5000/api/fetch_customer_records")
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col gap-10 px-4 py-20">
      <h2 className="text-2xl font-bold">View Customer List</h2>

      <div className="">
        {users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="rounded-md border border-gray-300 p-4 transition hover:bg-gray-50"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-lg font-medium">
                    <FaUser className="text-primary" />
                    {user.full_name} ({user.username})
                  </span>
                  <span className="flex items-center gap-2 text-sm text-gray-500">
                    <FaIdBadge /> {user.official_title}
                  </span>
                </div>

                <div className="flex flex-wrap justify-between gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <FaEnvelope /> {user.email}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaPhoneAlt /> {user.mobile_number}
                  </span>
                  {user.alternative_contact && (
                    <span className="flex items-center gap-2">
                      <FaPhoneAlt /> {user.alternative_contact}
                    </span>
                  )}
                  <span className="flex items-center gap-2">
                    <FaBuilding />{" "}
                    {user.institution_name || user.registered_institution}
                  </span>

                  {/* Role based on type */}
                  <span className="flex items-center gap-2 rounded-md bg-green-400 p-2 text-white">
                    <FaUser />{" "}
                    {user.role === 1
                      ? "Admin"
                      : user.role === 2
                        ? "Customer"
                        : "Unknown"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
