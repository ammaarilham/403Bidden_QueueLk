"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";

const page = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-10 px-4">
      <motion.img
        src="/assets/images/login/login-q-logo.png"
        alt="Login Logo"
        className="w-28 cursor-pointer rounded-xl"
        whileHover={{ scale: 1.05 }}
      />

      <div className="w-full max-w-md rounded-xl bg-white">
        <h2 className="mb-6 text-2xl font-bold">Login</h2>

        <form className="flex flex-col gap-6">
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Username or Email
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username or email"
              className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
              required
            />
            <span className="mt-2 text-xs font-light">
              Enter your username or email
            </span>
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

          <div className="flex justify-end text-sm">
            <a href="#" className="text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark rounded-md py-3 font-semibold transition"
          >
            Login
          </button>
        </form>

        <div className="my-6 flex items-center gap-2">
          <hr className="flex-grow border-gray-300" />
          <span className="whitespace-nowrap text-gray-500">Or login with</span>
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
          Don’t have an account? <span className="font-bold">Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default page;
