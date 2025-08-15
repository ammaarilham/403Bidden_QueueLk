"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import { TbLanguage } from "react-icons/tb";
import { HiOutlineLogout } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import SuccessRedirectPage from "@/components/shared/SuccessRedirectPage";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const Page = () => {
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<{
    username: string;
    full_name: string;
    official_title: string;
    employee_id: string;
    official_email: string;
    mobile_number: string;
    alternative_contact?: string;
    registered_institution: string;
    profile_picture: string;
  } | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/profile", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/bookings-count", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setBookingCount(data.count || 0))
      .catch((err) => console.error("Error fetching booking count:", err));
  }, []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const form = e.currentTarget;
    const full_name = (form.elements.namedItem("full_name") as HTMLInputElement)
      .value;
    const official_title = (
      form.elements.namedItem("official_title") as HTMLInputElement
    ).value;
    const employee_id = (
      form.elements.namedItem("employee_id") as HTMLInputElement
    ).value;
    const official_email = (
      form.elements.namedItem("official_email") as HTMLInputElement
    ).value;
    const mobile_number = (
      form.elements.namedItem("mobile_number") as HTMLInputElement
    ).value;
    const alternative_contact = (
      form.elements.namedItem("alternative_contact") as HTMLInputElement
    ).value;
    const registered_institution = (
      form.elements.namedItem("registered_institution") as HTMLInputElement
    ).value;
    const profile_picture = (
      form.elements.namedItem("profile_picture") as HTMLInputElement
    ).files?.[0];

    const formData = new FormData();
    formData.append("full_name", full_name);
    formData.append("official_title", official_title);
    formData.append("employee_id", employee_id);
    formData.append("official_email", official_email);
    formData.append("mobile_number", mobile_number);
    formData.append("alternative_contact", alternative_contact || "");
    formData.append("registered_institution", registered_institution);

    if (profile_picture) {
      formData.append("profile_picture", profile_picture);
    }

    try {
      const res = await fetch("http://localhost:5000/api/profile/update", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.error || "Something went wrong.",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Please try again later.",
      });
    }
  };

  if (!user) return <p>Loading...</p>;

  if (success) {
    return (
      <SuccessRedirectPage
        title="Profile Updated Successfully!"
        message=""
        showButton={true}
        buttonText="Go to Profile"
        buttonHref="/customer-dashboard/profile"
        redirectUrl="/customer-dashboard/profile"
        redirectDelay={1500}
      />
    );
  }

  return (
    <>
      {/* <Navbar /> */}
      <div className="flex min-h-screen w-full flex-col items-center gap-10 px-4 py-20">
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
              <h2 className="text-2xl font-bold text-gray-800">
                {bookingCount}
              </h2>
              <p className="text-primary mt-1 text-sm font-medium">Bookings</p>
            </div>
          </div>
        </div>
        {/* <h2 className="mb-2 text-2xl font-bold flex">Update Profile</h2> */}

        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              name="full_name"
              type="text"
              defaultValue={user.full_name}
              className="focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
              required
            />
          </div>

          {/* Official Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Official Title / Position
            </label>
            <input
              name="official_title"
              type="text"
              defaultValue={user.official_title}
              className="focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            />
          </div>

          {/* Employee ID */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Employee ID
            </label>
            <input
              name="employee_id"
              type="text"
              defaultValue={user.employee_id}
              className="focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            />
          </div>

          {/* Official Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Official Email
            </label>
            <input
              name="official_email"
              type="email"
              defaultValue={user.official_email}
              className="focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              name="mobile_number"
              type="text"
              defaultValue={user.mobile_number}
              className="focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            />
          </div>

          {/* Alternative Contact */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Alternative Contact
            </label>
            <input
              name="alternative_contact"
              type="text"
              defaultValue={user.alternative_contact || ""}
              className="focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            />
          </div>

          {/* Registered Institution */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Registered Institution
            </label>
            <input
              name="registered_institution"
              type="text"
              defaultValue={user.registered_institution}
              className="focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            />
          </div>

          {/* Profile Picture */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            {user.profile_picture && (
              <img
                src={`/assets/images/profile_pictures/${user.profile_picture}`}
                alt="Profile"
                className="mb-2 h-24 w-24 rounded-full object-cover"
              />
            )}
            <input
              name="profile_picture"
              type="file"
              accept="image/*"
              className="focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            />
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark rounded-md py-3 font-semibold transition"
          >
            Update Profile
          </button>
        </form>
      </div>
    </>
  );
};

export default Page;
