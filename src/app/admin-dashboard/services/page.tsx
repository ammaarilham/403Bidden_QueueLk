"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import SuccessRedirectPage from "@/components/shared/SuccessRedirectPage";
import {
  AiOutlineClockCircle,
  AiOutlineTeam,
  AiOutlineCalendar,
} from "react-icons/ai";

type Institution = {
  id: number;
  name: string;
};

const Page = () => {
  const [success, setSuccess] = useState(false);

  const [institutions, setInstitutions] = useState<
    { id: number; office_name: string }[]
  >([]);

  const [services, setServices] = useState<
    {
      id: number;
      service_name: string;
      institution_name: string;
      service_description?: string;
      appointment_duration?: number;
      daily_capacity?: number;
      days_of_week?: string;
    }[]
  >([]);

  useEffect(() => {
    // Fetch institutions
    fetch("http://localhost:5000/api/fetch_institutions")
      .then((res) => res.json())
      .then((data) => setInstitutions(data.institutions))
      .catch((err) => console.error(err));

    // Fetch existing services
    fetch("http://localhost:5000/api/fetch_services")
      .then((res) => res.json())
      .then((data) => setServices(data.services))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const service_name = (
      form.elements.namedItem("service_name") as HTMLInputElement
    ).value;
    const institution_id = (
      form.elements.namedItem("institution_id") as HTMLSelectElement
    ).value;
    const service_description = (
      form.elements.namedItem("service_description") as HTMLTextAreaElement
    ).value;
    const appointment_duration = (
      form.elements.namedItem("appointment_duration") as HTMLInputElement
    ).value;
    const daily_capacity = (
      form.elements.namedItem("daily_capacity") as HTMLInputElement
    ).value;

    // Days of week (checkboxes)
    const daysOfWeekElements = Array.from(
      form.querySelectorAll<HTMLInputElement>(
        'input[name="days_of_week"]:checked'
      )
    );
    const days_of_week = daysOfWeekElements.map((el) => el.value);

    if (
      !service_name ||
      !institution_id ||
      !appointment_duration ||
      !daily_capacity ||
      days_of_week.length === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill all required fields and select at least one day.",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_name,
          institution_id,
          service_description,
          appointment_duration: Number(appointment_duration),
          daily_capacity: Number(daily_capacity),
          days_of_week,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.error || "Something went wrong.",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Please try again later.",
      });
    }
  };

  if (success) {
    return (
      <SuccessRedirectPage
        title="Service Created Successfully!"
        message=""
        showButton={true}
        buttonText="Go to Services"
        buttonHref="/admin-dashboard/services/"
        redirectUrl="/admin-dashboard/services/"
        redirectDelay={1500}
      />
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col gap-10 px-4 py-20">
      <div className="flex w-full items-center justify-center">
        <motion.img
          src="/assets/images/login/login-q-logo.png"
          alt="Logo"
          className="flex w-28 cursor-pointer rounded-xl"
          whileHover={{ scale: 1.05 }}
        />
      </div>
      <h2 className="mb-2 text-2xl font-bold">Add a Service</h2>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Service Name
          </label>
          <input
            name="service_name"
            type="text"
            placeholder="Enter service name"
            className="focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Select Institution
          </label>
          <select
            name="institution_id"
            required
            className="focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
          >
            <option value="">Select Institution</option>
            {institutions.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.office_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Service Description
          </label>
          <textarea
            name="service_description"
            placeholder="Enter description"
            className="focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            rows={4}
          ></textarea>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Appointment Duration (minutes)
          </label>
          <input
            name="appointment_duration"
            type="number"
            placeholder="e.g., 30"
            className="focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Daily Capacity
          </label>
          <input
            name="daily_capacity"
            type="number"
            placeholder="e.g., 20"
            className="focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Days of the Week
          </label>
          <div className="flex flex-col gap-3">
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <label key={day} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="days_of_week"
                  value={day}
                  className="h-4 w-4"
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark rounded-md py-3 font-semibold transition"
        >
          Confirm
        </button>
      </form>

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          Existing Services
        </h2>

        {services.length === 0 ? (
          <p className="text-gray-500">No services added yet.</p>
        ) : (
          <div className="flex flex-col gap-5">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Service Header */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    {service.service_name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {service.institution_name}
                  </span>
                </div>

                {/* Description */}
                {service.service_description && (
                  <p className="mt-2 text-sm text-gray-700">
                    {service.service_description}
                  </p>
                )}

                {/* Meta Info */}
                <div className="my-5 flex justify-between gap-6 text-sm text-gray-600">
                  {service.appointment_duration && (
                    <span className="flex items-center gap-1 rounded-lg bg-yellow-200 p-2">
                      <AiOutlineClockCircle className="text-gray-500" />
                      {service.appointment_duration} min
                    </span>
                  )}
                  {service.daily_capacity && (
                    <span className="flex items-center gap-1 rounded-lg bg-green-200 p-2">
                      <AiOutlineTeam className="text-gray-500" />
                      {service.daily_capacity} per day
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-6 text-sm text-gray-600">
                  {service.days_of_week && (
                    <span className="flex items-center gap-1">
                      <AiOutlineCalendar className="text-gray-500" />
                      {service.days_of_week}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
