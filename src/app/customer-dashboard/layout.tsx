"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false); // prevent multiple redirects

  useEffect(() => {
    if (checked) return; // already checked, skip

    const checkSession = async () => {
      console.log("Checking session...");
      try {
        const res = await fetch("http://localhost:5000/api/session", {
          credentials: "include",
        });
        console.log("Response status:", res.status);

        if (!res.ok) throw new Error("Failed to fetch session");

        const data = await res.json();
        console.log("Session data:", data);

        if (data.loggedIn) {
          if (data.user.type === 2) {
            console.log("Customer detected, stay on this page");
            // Customer stays here
          } else if (data.user.type === 1) {
            console.log("Redirecting to admin dashboard");
            router.replace("/admin-dashboard");
          } else {
            router.replace("/login");
          }
        } else {
          router.replace("/login");
        }
      } catch (err) {
        console.error("Session check error:", err);
        router.replace("/login");
      } finally {
        setChecked(true);
        setLoading(false);
      }
    };

    checkSession();
  }, [router, checked]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-4 border-t-4 border-[#ebb517]"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
