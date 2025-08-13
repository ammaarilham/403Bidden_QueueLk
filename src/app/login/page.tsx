"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    console.log("Checking session...");

    fetch("http://localhost:5000/api/session", {
      credentials: "include", // send cookies
    })
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Session data:", data);
        if (data.loggedIn) {
          if (data.user.type === 1) {
            console.log("Redirecting to admin dashboard");
            router.push("/admin-dashboard");
          } else if (data.user.type === 2) {
            console.log("Redirecting to customer dashboard");
            router.push("/customer-dashboard");
          }
        } else {
          console.log("Not logged in");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement)
      .value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important to receive and send cookies automatically
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        await Swal.fire({
          icon: "success",
          title: "Login successful!",
          text: "Redirecting to dashboard...",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        if (data.type === 1) router.push("/admin-dashboard");
        else if (data.type === 2) router.push("/customer-dashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: data.error || "Invalid username or password",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: "Network error. Please try again.",
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-10 px-4">
      <motion.img
        src="/assets/images/login/login-q-logo.png"
        alt="Login Logo"
        className="w-28 cursor-pointer rounded-xl"
        whileHover={{ scale: 1.05 }}
      />

      <div className="w-full max-w-md rounded-xl bg-white">
        <h2 className="mb-6 text-2xl font-bold">Login</h2>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Username */}
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

          {/* Password */}
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

        {/* Social login */}
        <div className="my-6 flex items-center gap-2">
          <hr className="flex-grow border-gray-300" />
          <span className="whitespace-nowrap text-gray-500">Or login with</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="mb-10 flex justify-center gap-6">
          {[FaGoogle, FaApple, FaFacebookF].map((Icon, i) => (
            <button
              key={i}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 p-3 text-center transition-transform hover:scale-110"
            >
              <Icon className="text-black" size={24} />
            </button>
          ))}
        </div>

        <p className="text-center">
          Don’t have an account?{" "}
          <a className="font-bold" href="/signup">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Page;
