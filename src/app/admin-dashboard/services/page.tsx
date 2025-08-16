"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, ChevronDown, Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import SuccessRedirectPage from "@/components/shared/SuccessRedirectPage";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  service_name: z.string().min(1, "Service name is required"),
  institution_id: z.string().min(1, "Please select an institution"),
  service_description: z.string().optional(),
  appointment_duration: z
    .number()
    .min(1, "Appointment duration must be at least 1 minute"),
  daily_capacity: z.number().min(1, "Daily capacity must be at least 1"),
  days_of_week: z.array(z.string()).min(1, "Please select at least one day"),
});

type FormValues = z.infer<typeof formSchema>;

interface Institution {
  id: number;
  office_name: string;
}

interface Service {
  id: number;
  service_name: string;
  institution_name: string;
  service_description?: string;
  appointment_duration?: number;
  daily_capacity?: number;
  days_of_week?: string;
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Page = () => {
  const [success, setSuccess] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom select states
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service_name: "",
      institution_id: "",
      service_description: "",
      appointment_duration: 30,
      daily_capacity: 20,
      days_of_week: [],
    },
  });

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/fetch_institutions"),
      fetch("http://localhost:5000/api/fetch_services"),
    ])
      .then(async ([institutionsRes, servicesRes]) => {
        const institutionsData = await institutionsRes.json();
        const servicesData = await servicesRes.json();

        setInstitutions(institutionsData.institutions || []);
        setServices(servicesData.services || []);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        toast.error("Failed to load data");
      })
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          institution_id: Number(values.institution_id),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Service created successfully!", {
          description: "The new service has been added to the system.",
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

  const CustomSelect = ({ field, items, placeholder }: any) => {
    const selectedItemData = items.find(
      (item: any) => item.id.toString() === field.value
    );
    const selectedLabel = selectedItemData
      ? selectedItemData.office_name
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
          disabled={isSubmitting}
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
                <small className="">{item.office_name}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </div>
    );
  }

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
    <div className="flex min-h-dvh w-full flex-col items-center gap-10 py-20 pt-24">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6">
          <h3>Add a Service</h3>
          <small className="text-muted-foreground mt-2">
            Create a new service for an institution
          </small>
        </div>

        <Separator className="mb-8" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="service_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter service name"
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
              name="institution_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <CustomSelect
                      field={field}
                      items={institutions}
                      placeholder="Select an institution"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="service_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the service (optional)"
                      className="min-h-32 resize-none"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="appointment_duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="30"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="daily_capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="20"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="days_of_week"
              render={() => (
                <FormItem>
                  <FormLabel>Available Days</FormLabel>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {daysOfWeek.map((day) => (
                      <FormField
                        key={day}
                        control={form.control}
                        name="days_of_week"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={day}
                              className="flex flex-row items-center"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(day)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, day])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== day
                                          )
                                        );
                                  }}
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {day}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-6">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Service"}
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

        {/* Existing Services */}
        <div className="w-full">
          <div className="mb-6">
            <h3>Existing Services</h3>
            <small className="text-muted-foreground mt-2">
              Services currently available in the system
            </small>
          </div>

          {services.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              No services added yet.
            </p>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-col gap-2">
                        <h3 className="font-medium">{service.service_name}</h3>
                        <small className="text-muted-foreground !text-xs">
                          {service.institution_name}
                        </small>
                      </div>

                      {service.service_description && (
                        <small className="text-muted-foreground">
                          {service.service_description}
                        </small>
                      )}

                      <div className="mt-2 flex flex-wrap gap-3">
                        {service.appointment_duration && (
                          <div className="flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 text-xs">
                            <Clock className="h-3 w-3" />
                            {service.appointment_duration} min
                          </div>
                        )}
                        {service.daily_capacity && (
                          <div className="flex items-center gap-1 rounded-lg bg-green-100 px-2 py-1 text-xs">
                            <Users className="h-3 w-3" />
                            {service.daily_capacity} per day
                          </div>
                        )}
                        {service.days_of_week && (
                          <div className="flex items-center gap-1 rounded-lg bg-blue-100 px-2 py-1 text-xs">
                            <Calendar className="h-3 w-3" />
                            {service.days_of_week}
                          </div>
                        )}
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
