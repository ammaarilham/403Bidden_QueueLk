"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ClockAlert,
} from "lucide-react";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import SuccessRedirectPage from "@/components/shared/SuccessRedirectPage";

interface Booking {
  booking_number: number;
  type: "event" | "service";
  item_name: string;
  booking_date: string;
  created_at: string;
}

const formSchema = z.object({
  item_id: z.string().min(1, { message: "Please select an option" }),
  booking_date: z.date().refine((date) => date instanceof Date, {
    message: "Please select a valid booking date",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const Page = () => {
  const [activeTab, setActiveTab] = useState<"event" | "service">("service");
  const [success, setSuccess] = useState(false);
  const [events, setEvents] = useState<{ id: number; event_name: string }[]>(
    []
  );
  const [services, setServices] = useState<
    { id: number; service_name: string }[]
  >([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Custom select states
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item_id: "",
      booking_date: undefined,
    },
  });

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

  const onSubmit = async (values: FormValues) => {
    try {
      const bookingData = {
        type: activeTab,
        item_id: values.item_id,
        booking_date: format(values.booking_date, "yyyy-MM-dd"),
      };

      const res = await fetch("http://localhost:5000/api/add-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        toast("Booking submitted successfully!", {
          description: "You will receive a confirmation soon.",
        });
        setSuccess(true);
      } else {
        toast("Booking failed", {
          description: data.error || "Something went wrong.",
        });
      }
    } catch (err) {
      toast("Booking failed", {
        description: "A network error occurred. Please try again.",
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

  const filteredBookings = bookings.filter((b) => b.type === activeTab);
  const currentItems = activeTab === "service" ? services : events;

  const CustomSelect = ({ field, items, placeholder }: any) => {
    const selectedItemData = items.find(
      (item: any) => item.id.toString() === field.value
    );
    const selectedLabel = selectedItemData
      ? activeTab === "service"
        ? selectedItemData.service_name
        : selectedItemData.event_name
      : placeholder;

    return (
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-between",
            !field.value && "text-muted-foreground"
          )}
          onClick={() => setIsSelectOpen(!isSelectOpen)}
        >
          {selectedLabel}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
        {isSelectOpen && (
          <div className="bg-background absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border shadow-md">
            {items.map((item: any) => (
              <div
                key={item.id}
                className="hover:bg-muted cursor-pointer px-3 py-2 transition-colors"
                onClick={() => {
                  field.onChange(item.id.toString());
                  setIsSelectOpen(false);
                }}
              >
                <small className="">
                  {activeTab === "service"
                    ? item.service_name
                    : item.event_name}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-dvh w-full flex-col items-center gap-10 py-20 pt-24">
      {/* Booking Form Section */}
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6">
          <h3>Book an Appointment</h3>
          <small className="text-muted-foreground mt-2">
            Select whether you want to book a service or event
          </small>
        </div>

        <Tabs
          defaultValue="service"
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as "event" | "service");
            form.reset();
            setIsSelectOpen(false);
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="service">Service Booking</TabsTrigger>
            <TabsTrigger value="event">Event Booking</TabsTrigger>
          </TabsList>

          <TabsContent value="service" className="mt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="item_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Service</FormLabel>
                      <FormControl>
                        <CustomSelect
                          field={field}
                          items={services}
                          placeholder="Choose a service"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="booking_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Booking Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    Confirm Booking
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => form.reset()}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="event" className="mt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="item_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Event</FormLabel>
                      <FormControl>
                        <CustomSelect
                          field={field}
                          items={events}
                          placeholder="Choose an event"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="booking_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Booking Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    Confirm Booking
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => form.reset()}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </div>

      {/* Previous Bookings Section */}
      <div className="w-full">
        <div className="mb-6">
          <h3>Previous {activeTab} Bookings</h3>
          <small className="text-muted-foreground mt-2">
            Your booking history for {activeTab}s
          </small>
        </div>

        {filteredBookings.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">
            No previous {activeTab} bookings found.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.booking_number}>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="bg-primary/25 text-primary-foreground mb-2 w-fit rounded-full px-2.5 py-0.5 text-xs font-medium">
                      Booking #{booking.booking_number}
                    </span>
                    <h4>{booking.item_name}</h4>
                    <small className="text-muted-foreground">
                      {new Date(booking.booking_date).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </small>
                  </div>
                  <ClockAlert className="text-muted-foreground" />
                </div>
                <hr className="my-5" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
