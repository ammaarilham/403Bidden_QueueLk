"use client";

import { motion } from "framer-motion";
import { ArrowRight, Settings, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { SvgButton } from "../ui/svg-button";
import Link from "next/link";

const steps = [
  {
    title: "Book in Advance",
    description: "Reserve your government service slot before you visit.",
    img: "/assets/images/hero/5.svg",
  },
  {
    title: "Skip the Queue",
    description:
      "Check in with your QR code and join the digital line instantly.",
    img: "/assets/images/hero/2.svg",
  },
  {
    title: "Stay Updated",
    description:
      "Get instant SMS updates and know exactly when it's your turn.",
    img: "/assets/images/hero/3.svg",
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
    <div className="flex h-dvh w-full items-center justify-center px-4">
      {showRoleSelection ? (
        <section className="flex h-dvh items-center justify-center text-center">
          <div className="flex flex-col items-center gap-2">
            <h3>Please select the account type</h3>
            <div className="flex items-center gap-2">
              <SvgButton
                href="/login?role=admin"
                icon={Settings}
                onClick={() => handleRoleSelect("admin")}
              >
                Admin
              </SvgButton>
              <SvgButton
                href="/login?role=user"
                icon={Users}
                onClick={() => handleRoleSelect("user")}
              >
                User
              </SvgButton>
            </div>
            <small className="!font-normal">
              You will be directed to the login once you select the account
              type.
            </small>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center gap-16">
          <div className="select-none">
            <Link href="/">
              <Image
                width={163}
                height={48}
                src="/assets/branding/submark-logo.svg"
                alt="queue.lk logo"
              />
            </Link>
          </div>

          <div className="flex flex-col items-center justify-center px-8 text-center">
            <div className="">
              <h3 className="mb-1">{steps[stepIndex].title}</h3>
              <small className="!font-normal">
                {steps[stepIndex].description}
              </small>
            </div>
            <motion.div
              key={steps[stepIndex].img}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <Image
                width={120}
                height={300}
                src={steps[stepIndex].img}
                alt={steps[stepIndex].title}
                className="h-80 w-full"
              />
            </motion.div>
          </div>

          <Button onClick={handleNext}>
            {stepIndex === steps.length - 1 ? "Get Started" : "Next"}
            <ArrowRight />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Hero;
