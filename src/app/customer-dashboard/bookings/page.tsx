"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Swal from "sweetalert2";
import SuccessRedirectPage from "@/components/shared/SuccessRedirectPage";

interface Booking {
  booking_number: number;
  type: "event" | "service";
  item_name: string;
  booking_date: string;
  created_at: string;
}

const Page = () => {
  const [activeTab, setActiveTab] = useState<"event" | "service">("event");
  const [success, setSuccess] = useState(false);

  const [events, setEvents] = useState<{ id: number; event_name: string }[]>(
    []
  );
  const [services, setServices] = useState<
    { id: number; service_name: string }[]
  >([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Fetch events
    fetch("http://localhost:5000/api/fetch_events")
      .then((res) => res.json())
      .then((data) => setEvents(data.events || []))
      .catch((err) => console.error(err));

    // Fetch services
    fetch("http://localhost:5000/api/fetch_services")
      .then((res) => res.json())
      .then((data) => setServices(data.services || []))
      .catch((err) => console.error(err));

    // Fetch previous bookings
    fetch("http://localhost:5000/api/fetch-bookings", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings || []))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const bookingData =
      activeTab === "event"
        ? {
            type: "event",
            item_id: (form.elements.namedItem("event") as HTMLSelectElement)
              .value,
            booking_date: (
              form.elements.namedItem("booking_date") as HTMLInputElement
            ).value,
          }
        : {
            type: "service",
            item_id: (form.elements.namedItem("service") as HTMLSelectElement)
              .value,
            booking_date: (
              form.elements.namedItem("booking_date") as HTMLInputElement
            ).value,
          };

    try {
      const res = await fetch("http://localhost:5000/api/add-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Booking failed",
          text: data.error || "Something went wrong.",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Booking failed",
        text: "A network error occurred. Please try again.",
      });
    }
  };

  if (success) {
    return (
      <SuccessRedirectPage
        title="Booking submitted successfully!"
        message="You will receive a confirmation soon."
        showButton={true}
        buttonText="Go to Bookings"
        buttonHref="/customer-dashboard/bookings"
        redirectUrl="/customer-dashboard/bookings"
        redirectDelay={1500}
      />
    );
  }

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter((b) => b.type === activeTab);

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen w-full flex-col gap-6 px-4 pt-20">
        {/* Tabs */}
        <div className="flex w-full gap-2 rounded-full bg-gray-100 p-1 shadow-inner">
          <button
            onClick={() => setActiveTab("event")}
            className={`flex-1 rounded-full py-2 text-center font-semibold transition-all duration-300 ${
              activeTab === "event"
                ? "bg-primary text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Event
          </button>
          <button
            onClick={() => setActiveTab("service")}
            className={`flex-1 rounded-full py-2 text-center font-semibold transition-all duration-300 ${
              activeTab === "service"
                ? "bg-primary text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Service
          </button>
        </div>

        {/* Booking Form */}
        <div className="w-full max-w-md rounded-xl bg-white">
          <h2 className="mb-6 text-2xl font-bold capitalize">
            {activeTab} Booking
          </h2>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {activeTab === "event" ? (
              <div>
                <label
                  htmlFor="event"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Select Event
                </label>
                <select
                  id="event"
                  name="event"
                  className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
                  required
                >
                  <option value="">-- Select Event --</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.event_name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label
                  htmlFor="service"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Select Service
                </label>
                <select
                  id="service"
                  name="service"
                  className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
                  required
                >
                  <option value="">-- Select Service --</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.service_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label
                htmlFor="booking_date"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Booking Date
              </label>
              <input
                id="booking_date"
                name="booking_date"
                type="date"
                className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2"
                required
              />
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

        <div className="mt-4 w-full max-w-md rounded-xl bg-white">
          <h2 className="mb-4 text-2xl font-bold capitalize">
            Previous {activeTab}s
          </h2>
          {filteredBookings.length === 0 ? (
            <p className="text-gray-500">
              No previous {activeTab} bookings found.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {filteredBookings.map((b) => (
                <li
                  key={b.booking_number}
                  className="flex justify-between rounded-lg border border-gray-200 p-4 transition hover:shadow-lg"
                >
                  <div className="flex flex-col gap-1">
                    <span className="mb-2 inline-block w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                      Booking #: {b.booking_number}
                    </span>
                    <p className="font-semibold text-gray-800">{b.item_name}</p>
                    <p className="text-sm text-gray-500">
                      Booking Date: {b.booking_date}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(b.created_at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
