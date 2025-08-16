"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/session", {
          credentials: "include",
        });
        const data = await res.json();

        if (!data.loggedIn || data.user.type !== 1) {
          // Not logged in or not an admin
          router.replace("/login");
        }
      } catch (err) {
        console.error("Session check error:", err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

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
    <div className="py-10">
      <Navbar />
      <main className="">{children}</main>
    </div>
  );
}
