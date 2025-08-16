"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Clock, Users, Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { format } from "date-fns";
import * as z from "zod";

import SuccessRedirectPage from "@/components/shared/SuccessRedirectPage";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  event_name: z.string().min(1, "Event name is required"),
  event_type: z.string().min(1, "Event type is required"),
  event_description: z.string().optional(),
  event_date: z.date().refine((date) => date instanceof Date, {
    message: "Please select a valid event date",
  }),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  max_participants: z
    .number()
    .min(1, "Maximum participants must be at least 1"),
});

type FormValues = z.infer<typeof formSchema>;

interface Event {
  id: number;
  event_name: string;
  event_type: string;
  event_description?: string;
  event_date: string;
  start_time: string;
  end_time: string;
  max_participants: number;
}

const Page = () => {
  const [success, setSuccess] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event_name: "",
      event_type: "",
      event_description: "",
      event_date: undefined,
      start_time: "",
      end_time: "",
      max_participants: 50,
    },
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/fetch_events")
      .then((res) => res.json())
      .then((data) => setEvents(data.events || []))
      .catch((err) => {
        console.error("Error fetching events:", err);
        toast.error("Failed to load events");
      })
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          event_date: format(values.event_date, "yyyy-MM-dd"),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Event created successfully!", {
          description: "The new event has been added to the system.",
        });
        setSuccess(true);
      } else {
        toast.error("Creation failed", {
          description: data.error || "Something went wrong.",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Network error", {
        description: "Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

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
    <div className="flex min-h-dvh w-full flex-col items-center gap-10 py-20 pt-24">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6">
          <h3>Add an Event</h3>
          <small className="text-muted-foreground mt-2">
            Create a new event for the community
          </small>
        </div>

        <Separator className="mb-8" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="event_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter event name"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="event_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter event type"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="event_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the event (optional)"
                      className="min-h-32 resize-none"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="event_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Event Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isSubmitting}
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
                      <CalendarComponent
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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="max_participants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Participants</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="50"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-6">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Event"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting}
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>

        <Separator className="my-8" />

        {/* Existing Events */}
        <div className="w-full">
          <div className="mb-6">
            <h3>Existing Events</h3>
            <small className="text-muted-foreground mt-2">
              Events currently scheduled in the system
            </small>
          </div>

          {events.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              No events added yet.
            </p>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-col gap-2">
                        <h3 className="font-medium">{event.event_name}</h3>
                        <small className="text-muted-foreground !text-xs">
                          {event.event_type}
                        </small>
                      </div>

                      {event.event_description && (
                        <small className="text-muted-foreground">
                          {event.event_description}
                        </small>
                      )}

                      <div className="mt-2 flex flex-wrap gap-3">
                        <div className="flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 text-xs">
                          <Calendar className="h-3 w-3" />
                          {event.event_date}
                        </div>
                        <div className="flex items-center gap-1 rounded-lg bg-blue-100 px-2 py-1 text-xs">
                          <Clock className="h-3 w-3" />
                          {event.start_time} - {event.end_time}
                        </div>
                        <div className="flex items-center gap-1 rounded-lg bg-green-100 px-2 py-1 text-xs">
                          <Users className="h-3 w-3" />
                          {event.max_participants} participants
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="my-5" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
