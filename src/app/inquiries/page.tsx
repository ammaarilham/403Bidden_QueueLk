"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import Navbar from "@/components/shared/Navbar";
import SuccessRedirectPage from "@/components/shared/SuccessRedirectPage";

const Page = () => {
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const inquiry = (form.elements.namedItem("inquiry") as HTMLTextAreaElement)
      .value;

    try {
      const res = await fetch("http://localhost:5000/api/add-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, inquiry }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ set state to show success page
        setSuccess(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission failed",
          text: data.error || "Something went wrong.",
        });
      }
    } catch (err) {
      console.error("Error submitting inquiry:", err);
      Swal.fire({
        icon: "error",
        title: "Submission failed",
        text: "A network error occurred. Please try again.",
      });
    }
  };

  if (success) {
    // Show success page instead of form
    return (
      <SuccessRedirectPage
        title="Inquiry sent successfully!"
        message="You will receive an SMS with the details..."
        showButton={true}
        buttonText="Go to Inquiries"
        buttonHref="/inquiries"
        redirectUrl="/inquiries"
        redirectDelay={1500}
      />
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen w-full flex-col items-center gap-10 px-4 pt-20">
        <div className="w-full max-w-md rounded-xl">
          <h2 className="mb-6 text-2xl font-bold">Inquiries</h2>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* form inputs */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Your Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
                required
              />
            </div>

            <div>
              <label
                htmlFor="inquiry"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Your Inquiry
              </label>
              <textarea
                id="inquiry"
                name="inquiry"
                placeholder="Write your inquiry here"
                className="focus:border-primary focus:ring-primary h-32 w-full resize-none rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
                required
              ></textarea>
            </div>

            <div className="flex w-full gap-2">
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark w-full rounded-md py-3 font-semibold transition"
              >
                Confirm
              </button>
              <button
                type="button"
                className="hover:bg-primary-dark w-full rounded-md bg-gray-200 py-3 font-semibold transition"
                onClick={(e) => {
                  const form = e.currentTarget.closest(
                    "form"
                  ) as HTMLFormElement;
                  form.reset();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;
