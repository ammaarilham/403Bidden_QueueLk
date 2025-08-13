"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface SuccessRedirectPageProps {
  title: string; // h2 text
  message: string; // first paragraph
  showButton?: boolean; // whether to show the button
  buttonText?: string; // button text
  buttonHref?: string; // button redirect URL (for button click)
  redirectUrl?: string; // automatic redirect URL
  redirectDelay?: number; // delay in ms before redirect (default 1000)
}

const SuccessRedirectPage: React.FC<SuccessRedirectPageProps> = ({
  title,
  message,
  showButton = false,
  buttonText = "Confirm",
  buttonHref = "/",
  redirectUrl,
  redirectDelay = 1000,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (redirectUrl) {
      const timer = setTimeout(() => {
        router.push(redirectUrl);
      }, redirectDelay);

      return () => clearTimeout(timer); // cleanup
    }
  }, [redirectUrl, redirectDelay, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center px-4">
      <motion.img
        src="/assets/images/login/login-q-logo.png"
        alt="Logo"
        className="w-38 cursor-pointer rounded-xl"
      />

      <h2 className="mb-4 mt-10 text-2xl font-bold">{title}</h2>
      <p className="text-lg text-gray-800">{message}</p>
      {redirectUrl && (
        <p className="text-sm text-gray-500">
          You will be redirected in {redirectDelay / 1000}s...
        </p>
      )}

      {showButton && (
        <a
          href={buttonHref}
          className="bg-primary hover:bg-primary-dark mt-12 w-full rounded-md py-3 text-center font-semibold transition"
        >
          {buttonText}
        </a>
      )}
    </div>
  );
};

export default SuccessRedirectPage;
