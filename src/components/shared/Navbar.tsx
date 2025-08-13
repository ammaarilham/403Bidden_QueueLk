"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { HiMenu, HiX, HiOutlineLogout } from "react-icons/hi";
import {
  FaTicketAlt,
  FaQuestionCircle,
  FaLifeRing,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { FiHeadphones, FiTool } from "react-icons/fi";
import { FiMail, FiSearch, FiSettings } from "react-icons/fi";
import { AiOutlineDashboard } from "react-icons/ai"; // Ant Design

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type User = {
  username: string;
  profilePicUrl: string;
  type: number; // 1 for admin, 2 for customer
};

const Navbar: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/session", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch session");
        return res.json();
      })
      .then((data) => {
        if (data.loggedIn) {
          setUser({
            username: data.user.username,
            profilePicUrl:
              data.user.profilePicUrl ||
              "/assets/images/common/default-profile.png",
            type: data.user.type,
          });
        } else {
          setUser(null);
        }
      })
      .catch((err) => {
        console.error(err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <nav className="flex items-center justify-between bg-white px-4 py-3 shadow-md">
        <div>Loading...</div>
      </nav>
    );
  }

  if (!user) return null;

  const userTypeLabel =
    user.type === 1 ? "Admin" : user.type === 2 ? "Customer" : "-";

  const pages = [
    {
      name: "Dashboard",  
      href: "/customer-dashboard",
      icon: <AiOutlineDashboard size={20} />,
    },
    {
      name: "Queue Booking",
      href: "/queue_booking",
      icon: <FaTicketAlt size={20} />,
    },
    { name: "Inquiries", href: "#", icon: <FiMail size={20} /> },
    { name: "Support", href: "#", icon: <FiTool size={20} /> },
    { name: "Settings", href: "#", icon: <FiSettings size={20} /> },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include", // send cookies
      });

      if (res.ok) {
        // Redirect to frontend login page
        window.location.href = "http://localhost:3000/login";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 flex items-center justify-between bg-white px-4 py-3">
        {/* Left: profile pic + username + user type */}
        <div className="flex items-center space-x-3">
          <img
            src={user.profilePicUrl}
            alt="Profile"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-gray-800">{user.username}</span>
            <span className="text-xs text-gray-500">{userTypeLabel}</span>
          </div>
        </div>

        {/* Right: hamburger only when menu is closed */}
        {!menuOpen && (
          <button
            onClick={() => setMenuOpen(true)}
            className="focus:ring-primary rounded-md text-gray-800 focus:outline-none focus:ring-2"
            aria-label="Open menu"
          >
            <HiMenu size={28} />
          </button>
        )}
      </nav>

      {/* Sliding menu */}
      <div
        className={`fixed right-0 top-0 z-40 flex h-full w-72 flex-col justify-between bg-white shadow-lg transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button inside sliding menu, top right */}
        <div>
          <div className="mb-8 flex items-center justify-between p-4">
            <button
              onClick={() => setMenuOpen(false)}
              className="focus:ring-primary absolute right-4 top-4 rounded-md p-1 text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2"
              aria-label="Close menu"
            >
              <HiX size={28} />
            </button>

            {/* Logo at top of sliding menu */}
            <motion.img
              src="/assets/images/hero/logo-4.png"
              alt="Logo"
              className="w-40 rounded-xl"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
            />
          </div>
          {/* Menu links */}
          <nav className="flex flex-col space-y-4 px-6">
            {pages.map(({ name, href, icon }) => (
              <a
                key={name}
                href={href}
                className="hover:text-primary flex items-center gap-3 text-lg font-medium"
                onClick={() => setMenuOpen(false)} // close menu on click
              >
                {icon}
                {name}
              </a>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mx-6 mb-6 flex items-center gap-3 rounded-md px-4 py-2 text-red-600"
        >
          <HiOutlineLogout size={20} />
          Logout
        </button>
      </div>

      {/* Overlay to close menu */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/20 bg-opacity-20"
        />
      )}
    </>
  );
};

export default Navbar;
