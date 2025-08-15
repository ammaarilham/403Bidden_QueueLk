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

type Event = {
  id: number;
  event_name: string;
  event_type: string;
  event_description?: string;
  event_date: string;
  start_time: string;
  end_time: string;
  max_participants: number;
};

const Page = () => {
  const [success, setSuccess] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/fetch_events")
      .then((res) => res.json())
      .then((data) => setEvents(data.events))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const event_name = (
      form.elements.namedItem("event_name") as HTMLInputElement
    ).value;
    const event_type = (
      form.elements.namedItem("event_type") as HTMLInputElement
    ).value;
    const event_description = (
      form.elements.namedItem("event_description") as HTMLTextAreaElement
    ).value;
    const event_date = (
      form.elements.namedItem("event_date") as HTMLInputElement
    ).value;
    const start_time = (
      form.elements.namedItem("start_time") as HTMLInputElement
    ).value;
    const end_time = (form.elements.namedItem("end_time") as HTMLInputElement)
      .value;
    const max_participants = (
      form.elements.namedItem("max_participants") as HTMLInputElement
    ).value;

    if (
      !event_name ||
      !event_type ||
      !event_date ||
      !start_time ||
      !end_time ||
      !max_participants
    ) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill all required fields.",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_name,
          event_type,
          event_description,
          event_date,
          start_time,
          end_time,
          max_participants: Number(max_participants),
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
      console.error(err);
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
        title="Event Created Successfully!"
        message=""
        showButton={true}
        buttonText="Go to Events"
        buttonHref="/admin-dashboard/events/"
        redirectUrl="/admin-dashboard/events/"
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

      <h2 className="mb-2 text-2xl font-bold">Add an Event</h2>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Event Name
          </label>
          <input
            name="event_name"
            type="text"
            placeholder="Enter event name"
            className="focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Event Type
          </label>
          <input
            name="event_type"
            type="text"
            placeholder="Enter event type"
            className="focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Event Description
          </label>
          <textarea
            name="event_description"
            placeholder="Enter description"
            className="focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Event Date
            </label>
            <input
              name="event_date"
              type="date"
              className="focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              name="start_time"
              type="time"
              className="focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              End Time
            </label>
            <input
              name="end_time"
              type="time"
              className="focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Maximum Participants
          </label>
          <input
            name="max_participants"
            type="number"
            placeholder="e.g., 50"
            className="focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark rounded-md py-3 font-semibold transition"
        >
          Confirm
        </button>
      </form>

      {/* Existing Events */}
      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          Existing Events
        </h2>
        {events.length === 0 ? (
          <p className="text-gray-500">No events added yet.</p>
        ) : (
          <div className="flex flex-col gap-5">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    {event.event_name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {event.event_type}
                  </span>
                </div>

                {event.event_description && (
                  <p className="mt-2 text-sm text-gray-700">
                    {event.event_description}
                  </p>
                )}

                <div className="my-5 flex flex-wrap gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-1 rounded-lg bg-yellow-200 p-2">
                    <AiOutlineCalendar className="text-gray-500" />{" "}
                    {event.event_date}
                  </span>
                  <span className="flex items-center gap-1 rounded-lg bg-blue-200 p-2">
                    <AiOutlineClockCircle className="text-gray-500" />{" "}
                    {event.start_time} - {event.end_time}
                  </span>
                  <span className="flex items-center gap-1 rounded-lg bg-green-200 p-2">
                    <AiOutlineTeam className="text-gray-500" />{" "}
                    {event.max_participants} participants
                  </span>
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
