"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HiMenu, HiX, HiOutlineLogout } from "react-icons/hi";
import { FaTicketAlt } from "react-icons/fa";
import { FiMail, FiTool, FiSettings } from "react-icons/fi";
import { AiOutlineDashboard } from "react-icons/ai";
import { motion } from "framer-motion";
import { TbUsers } from "react-icons/tb";
import { CiSettings } from "react-icons/ci";

type User = {
  username: string;
  profilePicUrl: string;
  type: number; // 1 = admin, 2 = customer
};

const Navbar: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/session", {
          credentials: "include",
        });
        const data = await res.json();

        if (!data.loggedIn) {
          router.replace("/login");
        } else {
          // Use uploaded profile picture if exists, otherwise default
          const profilePicUrl = data.user.profile_picture
            ? `/assets/images/profile_pictures/${data.user.profile_picture}`
            : "/assets/images/common/default-profile.png";

          setUser({
            username: data.user.username,
            profilePicUrl,
            type: data.user.type,
          });
        }
      } catch (err) {
        console.error(err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) return null; // hide navbar while checking session
  if (!user) return null; // safety

  const userTypeLabel = user.type === 1 ? "Admin" : "Customer";

  // Role-based pages
  const pages =
    user.type === 1
      ? [
          {
            name: "Admin Dashboard",
            href: "/admin-dashboard",
            icon: <AiOutlineDashboard size={20} />,
          },
          {
            name: "Add Institution",
            href: "/admin-dashboard/institutions",
            icon: <TbUsers size={20} />,
          },
          {
            name: "Add Service",
            href: "/admin-dashboard/services",
            icon: <CiSettings size={20} />,
          },
          {
            name: "Add Event",
            href: "/admin-dashboard/events",
            icon: <FaTicketAlt size={20} />,
          },
          { name: "Support", href: "#", icon: <FiTool size={20} /> },
          { name: "Settings", href: "#", icon: <FiSettings size={20} /> },
        ]
      : [
          {
            name: "Customer Dashboard",
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
        credentials: "include",
      });
      if (res.ok) router.replace("/login");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return (
    <>
      <nav className="sh fixed left-0 right-0 top-0 flex items-center justify-between bg-white px-4 py-3">
        <div
          onClick={() =>
            router.push(
              user.type === 1
                ? "/admin-dashboard/profile"
                : "/customer-dashboard/profile"
            )
          }
          className="flex cursor-pointer items-center space-x-3"
        >
          <img
            src={user.profilePicUrl}
            alt="Profile"
            className="h-12 w-12 rounded-full object-cover"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold text-gray-800">
              {user.username}
            </span>
            <span className="text-xs text-gray-500">{userTypeLabel}</span>
          </div>
        </div>

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
        <div>
          <div className="mb-8 flex items-center justify-between p-4">
            <button
              onClick={() => setMenuOpen(false)}
              className="focus:ring-primary absolute right-4 top-4 rounded-md p-1 text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2"
              aria-label="Close menu"
            >
              <HiX size={28} />
            </button>

            <motion.img
              src="/assets/images/hero/logo-4.png"
              alt="Logo"
              className="w-40 rounded-xl"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
            />
          </div>

          <nav className="flex flex-col space-y-4 px-6">
            {pages.map(({ name, href, icon }) => (
              <a
                key={name}
                href={href}
                className="hover:text-primary flex items-center gap-3 text-lg font-medium"
                onClick={() => setMenuOpen(false)}
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

      {/* Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/20"
        />
      )}
    </>
  );
};

export default Navbar;
