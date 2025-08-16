"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

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
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-0">
      <Image
        height={80}
        width={95}
        src="/assets/branding/icon.svg"
        alt="Queue.lk logo"
        className="mb-4 size-24 cursor-pointer"
      />

      <h3 className="text-center text-2xl font-bold">{title}</h3>
      <p className="text-muted-foreground mt-2">{message}</p>
      {/* {redirectUrl && (
        <small className="text-sm text-gray-500">
          You will be redirected in {redirectDelay / 1000}s...
        </small>
      )} */}

      {showButton && (
        <Button asChild className="mt-6">
          <Link href={buttonHref}>
            {buttonText} <ArrowRight />
          </Link>
        </Button>
      )}
    </div>
  );
};

export default SuccessRedirectPage;
