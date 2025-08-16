"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineDashboard } from "react-icons/ai";
import { CiSettings } from "react-icons/ci";
import { FaTicketAlt } from "react-icons/fa";
import { FiMail, FiSettings, FiTool } from "react-icons/fi";
import { HiOutlineLogout } from "react-icons/hi";
import { TbUsers } from "react-icons/tb";
import { Button } from "../ui/button";

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
      <nav className="bg-background fixed left-0 right-0 top-0 z-50 mx-auto flex max-w-sm items-center justify-between border-x px-4 pb-4 pt-10">
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
            className="border-input size-9 rounded-full border object-cover"
          />
          <div className="flex flex-col leading-tight">
            <small className="text-muted-foreground !text-xs !leading-[110%]">
              Hello there,
            </small>
            <small className="text-lg font-semibold">{user.username}</small>
          </div>

          <small className="rounded-2xl bg-green-100 px-2 py-0.5 !text-xs uppercase text-green-600">
            {userTypeLabel}
          </small>
        </div>

        {!menuOpen && (
          <Button
            onClick={() => setMenuOpen(true)}
            variant={"ghost"}
            size={"icon"}
            aria-label="Open menu"
            className="flex size-8 items-center justify-center"
          >
            <Menu className="size-5" />
          </Button>
        )}
      </nav>

      {/* Sliding menu */}
      <div
        className={`fixed right-0 top-0 z-40 flex h-full w-72 flex-col justify-between bg-white shadow-lg transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          <div className="mb-4 flex flex-row-reverse items-center justify-between p-4">
            <Button
              onClick={() => setMenuOpen(false)}
              variant={"ghost"}
              size={"icon"}
              aria-label="Open menu"
              className="flex size-8 items-center justify-center"
            >
              <X className="size-5" />
            </Button>

            <motion.img
              src="/assets/images/hero/logo-4.png"
              alt="Logo"
              className="w-40 rounded-xl"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.01 }}
            />
          </div>

          <nav className="flex flex-col space-y-4 px-4">
            {pages.map(({ name, href, icon }) => (
              <a
                key={name}
                href={href}
                className="hover:text-primary flex items-center gap-3 text-base font-medium transition-all duration-300 ease-in-out"
                onClick={() => setMenuOpen(false)}
              >
                {icon}
                {name}
              </a>
            ))}
          </nav>
        </div>

        <Button
          variant={"ghost"}
          onClick={handleLogout}
          className="mx-4 mb-4 flex items-center gap-3 rounded-md px-4 py-2 text-red-600"
        >
          <HiOutlineLogout size={20} />
          Logout
        </Button>
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
