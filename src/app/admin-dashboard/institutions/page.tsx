"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import SuccessRedirectPage from "@/components/shared/SuccessRedirectPage";

const page = () => {
  const [workingDays, setWorkingDays] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const toggleDay = (day: string) => {
    setWorkingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const office_name = (
      form.elements.namedItem("office_name") as HTMLInputElement
    ).value;
    const department_or_ministry = (
      form.elements.namedItem("department_or_ministry") as HTMLInputElement
    ).value;
    const office_type = (
      form.elements.namedItem("office_type") as HTMLInputElement
    ).value;
    const office_address = (
      form.elements.namedItem("office_address") as HTMLInputElement
    ).value;
    const district = (form.elements.namedItem("district") as HTMLInputElement)
      .value;
    const official_email = (
      form.elements.namedItem("official_email") as HTMLInputElement
    ).value;
    const office_phone = (
      form.elements.namedItem("office_phone") as HTMLInputElement
    ).value;

    if (!workingDays.length) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please select at least one working day.",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          office_name,
          department_or_ministry,
          office_type,
          office_address,
          district,
          official_email,
          office_phone,
          working_days: workingDays, // <-- use your state here
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ set state to show success page
        setSuccess(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.error || "Something went wrong.",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Please try again later.",
      });
    }
  };

  if (success) {
    // Show success page instead of form
    return (
      <SuccessRedirectPage
        title="Institution created Successfully!"
        message=""
        showButton={true}
        buttonText="Go to Dashboard"
        buttonHref="/admin-dashboard"
        redirectUrl="/admin-dashboard"
        redirectDelay={1500}
      />
    );
  }

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="flex min-h-screen w-full flex-col gap-10 px-4 py-20">
      <div className="flex w-full items-center justify-center">
        <motion.img
          src="/assets/images/login/login-q-logo.png"
          alt="Login Logo"
          className="flex w-28 cursor-pointer rounded-xl"
          whileHover={{ scale: 1.05 }}
        />
      </div>

      <h2 className="mb-2 text-2xl font-bold">Add new Office/Institution</h2>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Office Name
          </label>
          <input
            name="office_name"
            type="text"
            placeholder="Enter office name"
            className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Department / Ministry
          </label>
          <input
            name="department_or_ministry"
            type="text"
            placeholder="Enter department or ministry"
            className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Office Type
          </label>
          <input
            name="office_type"
            type="text"
            placeholder="Enter office type"
            className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Office Address
          </label>
          <input
            name="office_address"
            type="text"
            placeholder="Enter office address"
            className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            District
          </label>
          <input
            name="district"
            type="text"
            placeholder="Enter district"
            className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Official Email
          </label>
          <input
            name="official_email"
            type="email"
            placeholder="Enter official email"
            className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Office Phone
          </label>
          <input
            name="office_phone"
            type="text"
            placeholder="Enter phone number"
            className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Working Days
          </label>
          <div className="flex flex-col gap-2">
            {days.map((day) => (
              <label
                key={day}
                className="flex cursor-pointer items-center gap-2 rounded-md"
              >
                <input
                  type="checkbox"
                  checked={workingDays.includes(day)}
                  onChange={() => toggleDay(day)}
                  className="accent-primary"
                />
                <span className="text-gray-700">{day}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark rounded-md py-3 font-semibold transition"
        >
          Confirm
        </button>
      </form>
    </div>
  );
};

export default page;
