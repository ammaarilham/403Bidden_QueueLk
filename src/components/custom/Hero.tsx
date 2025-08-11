"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useRouter } from "next/navigation";

const steps = [
  {
    title: "Book in Advance",
    description: "Reserve your government service slot before you visit.",
    img: "/assets/images/hero/hero-img-1.png",
  },
  {
    title: "Skip the Queue",
    description:
      "Check in with your QR code and join the digital line instantly.",
    img: "/assets/images/hero/hero-img-2.png",
  },
  {
    title: "Stay Updated",
    description:
      "Get instant SMS updates and know exactly when it’s your turn.",
    img: "/assets/images/hero/hero-img-3.png",
  },
];

const Hero = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setShowRoleSelection(true);
    }
  };

  const handleRoleSelect = (role: "user" | "admin") => {
    router.push(`/login?role=${role}`);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      {showRoleSelection ? (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl font-semibold">
            Please select the account type
          </h2>
          <div className="flex gap-4">
            <motion.img
              src="/assets/images/hero/hero-user-bg-img.png"
              alt="User Account"
              className="w-50 md:w-50 cursor-pointer rounded-xl"
              onClick={() => handleRoleSelect("user")}
              whileHover={{ scale: 1.05 }}
            />
            <motion.img
              src="/assets/images/hero/hero-admin-bg-img.png"
              alt="Admin Account"
              className="w-50 md:w-50 cursor-pointer rounded-xl"
              onClick={() => handleRoleSelect("admin")}
              whileHover={{ scale: 1.05 }}
            />
          </div>
          <p className="text-center">
            You will be directed to the login once you select the account type.
          </p>
        </div>
      ) : (
        // Slides View
        <div className="flex flex-col items-center justify-center">
          <div>
            <motion.img
              src="/assets/images/hero/logo-4.png"
              alt="BG Remover Logo"
              className="w-50 md:w-50 rounded-xl"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
            />
          </div>

          <div className="flex flex-col items-center justify-center p-10 text-center">
            <h2 className="mb-3 text-2xl font-bold">
              {steps[stepIndex].title}
            </h2>
            <p className="mb-5">{steps[stepIndex].description}</p>

            <motion.img
              key={steps[stepIndex].img}
              src={steps[stepIndex].img}
              alt={steps[stepIndex].title}
              className="rounded-xl transition duration-300 ease-in-out hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
            />
          </div>

          <div>
            <button
              onClick={handleNext}
              className="bg-primary flex items-center gap-2 rounded-sm p-2"
            >
              <span>
                {stepIndex === steps.length - 1 ? "Get Started" : "Next"}
              </span>
              <AiOutlineArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
