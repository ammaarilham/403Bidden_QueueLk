"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";
import Swal from "sweetalert2";

const Page = () => {
  const [conditionsSelected, setConditionsSelected] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement)
      .value;
    const email = (form.elements.namedItem("useremail") as HTMLInputElement)
      .value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const confirmPassword = (
      form.elements.namedItem("confirm_password") as HTMLInputElement
    ).value;

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Passwords do not match.",
      });
      return; // stop submission if passwords don't match
    }

    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        await Swal.fire({
          icon: "success",
          title: "Signup successful!",
          text: "You will be redirected to the login page.",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        window.location.href = "/login";
      } else {
        Swal.fire({
          icon: "error",
          title: "Signup failed",
          text: data.error || "Something went wrong.",
        });
      }
    } catch (err) {
      console.error("Error signing up:", err);
      Swal.fire({
        icon: "error",
        title: "Signup failed",
        text: "A network error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-10 px-4 py-10">
      <motion.img
        src="/assets/images/login/login-q-logo.png"
        alt="Login Logo"
        className="w-28 cursor-pointer rounded-xl"
        whileHover={{ scale: 1.05 }}
      />

      <div className="w-full max-w-md rounded-xl bg-white">
        <h2 className="mb-6 text-2xl font-bold">Sign up</h2>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              User Name
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username or email"
              className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
              required
            />
            <span className="mt-2 text-xs font-light">Enter your username</span>
          </div>
          <div>
            <label
              htmlFor="useremail"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="useremail"
              type="email"
              placeholder="Enter your email"
              className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
              required
            />
            <span className="mt-2 text-xs font-light">Enter your email</span>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
              required
            />
            <span className="mt-2 text-xs font-light">Enter your password</span>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>

            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              placeholder="Enter your password again"
              className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
              required
            />
            <span className="mt-2 text-xs font-light">Enter your password</span>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-sm bg-red-100 p-3 text-sm">
            <input
              type="checkbox"
              name="terms_checkbox"
              id="terms_checkbox"
              className="mt-0.5"
              onClick={() => setConditionsSelected((prev) => !prev)}
            />
            <label htmlFor="terms_checkbox" className="leading-snug">
              You have read & accepted our terms & conditions.
            </label>
          </div>

          <button
            type="submit"
            disabled={!conditionsSelected}
            className="bg-primary hover:bg-primary-dark rounded-md py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sign up
          </button>
        </form>

        <div className="my-6 flex items-center gap-2">
          <hr className="flex-grow border-gray-300" />
          <span className="whitespace-nowrap text-gray-500">
            Or register with
          </span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="mb-10 flex justify-center gap-6">
          <button
            type="button"
            aria-label="Login with Google"
            className="flex w-full justify-center rounded-lg border border-gray-300 p-3 text-center transition-transform hover:scale-110"
          >
            <FaGoogle className="text-black" size={24} />
          </button>

          <button
            type="button"
            aria-label="Login with Apple"
            className="flex w-full justify-center rounded-lg border border-gray-300 p-3 transition-transform hover:scale-110"
          >
            <FaApple className="text-black" size={24} />
          </button>

          <button
            type="button"
            aria-label="Login with Facebook"
            className="flex w-full justify-center rounded-lg border border-gray-300 p-3 transition-transform hover:scale-110"
          >
            <FaFacebookF className="text-black" size={24} />
          </button>
        </div>

        <p className="text-center">
          Already have an account?
          <a className="font-bold" href="/login">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Page;
