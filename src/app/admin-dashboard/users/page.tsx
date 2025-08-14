"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import SuccessRedirectPage from "@/components/shared/SuccessRedirectPage";

const Page = () => {
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    const username = (form.elements.namedItem("username") as HTMLInputElement)
      .value;
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
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const confirm_password = (
      form.elements.namedItem("confirm_password") as HTMLInputElement
    ).value;

    if (password !== confirm_password) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Passwords do not match.",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          fullName: full_name,
          officialTitle: official_title,
          employeeId: employee_id,
          officialEmail: official_email,
          mobileNumber: mobile_number,
          alternativeContact: alternative_contact,
          registeredInstitution: registered_institution,
          password,
          confirmPassword: confirm_password,
        }),
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
      console.error("Error:", err);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Please try again later.",
      });
    }
  };

  if (success) {
    return (
      <SuccessRedirectPage
        title="Admin Access Created Successfully!"
        message=""
        showButton={true}
        buttonText="Go to Dashboard"
        buttonHref="/admin-dashboard"
        redirectUrl="/admin-dashboard"
        redirectDelay={1500}
      />
    );
  }

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

      <h2 className="mb-2 text-2xl font-bold">Manage Admin Access</h2>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            User name
          </label>
          <input
            name="username"
            type="text"
            placeholder="Enter username"
            className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            name="full_name"
            type="text"
            placeholder="Enter full name"
            className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Official Title / Position
          </label>
          <input
            name="official_title"
            type="text"
            placeholder="Enter official title"
            className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Employee ID / Service Number
          </label>
          <input
            name="employee_id"
            type="text"
            placeholder="Enter employee ID"
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
            Mobile Number
          </label>
          <input
            name="mobile_number"
            type="text"
            placeholder="Enter mobile number"
            className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Alternative Contact
          </label>
          <input
            name="alternative_contact"
            type="text"
            placeholder="Enter alternative contact (optional)"
            className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Registered Institution
          </label>
          <input
            name="registered_institution"
            type="text"
            placeholder="Enter registered institution"
            className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="Enter password"
            className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            name="confirm_password"
            type="password"
            placeholder="Confirm password"
            className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            required
          />
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

export default Page;
