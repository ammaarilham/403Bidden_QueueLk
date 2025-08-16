"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building, Mail, Phone, MapPin, Calendar } from "lucide-react";
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

const formSchema = z.object({
  office_name: z.string().min(1, "Office name is required"),
  department_or_ministry: z.string().min(1, "Department/Ministry is required"),
  office_type: z.string().min(1, "Office type is required"),
  office_address: z.string().min(1, "Office address is required"),
  district: z.string().min(1, "District is required"),
  official_email: z.string().email("Please enter a valid email address"),
  office_phone: z.string().optional(),
  working_days: z
    .array(z.string())
    .min(1, "Please select at least one working day"),
});

type FormValues = z.infer<typeof formSchema>;

interface Institution {
  id: number;
  office_name: string;
  department_or_ministry: string;
  office_type: string;
  office_address: string;
  district: string;
  official_email: string;
  office_phone?: string;
  working_days: string[];
}

const workingDaysOptions = [
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
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      office_name: "",
      department_or_ministry: "",
      office_type: "",
      office_address: "",
      district: "",
      official_email: "",
      office_phone: "",
      working_days: [],
    },
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/fetch_all_institutions")
      .then((res) => res.json())
      .then((data) => setInstitutions(data.institutions || []))
      .catch((err) => {
        console.error("Error fetching institutions:", err);
        toast.error("Failed to load institutions");
      })
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Institution created successfully!", {
          description: "The new institution has been added to the system.",
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
          <p className="text-muted-foreground">Loading institutions...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <SuccessRedirectPage
        title="Institution created Successfully!"
        message=""
        showButton={true}
        buttonText="Go to Dashboard"
        buttonHref="/admin-dashboard"
        redirectUrl="/admin-dashboard"
        redirectDelay={1500}
      />
    );
  }

  return (
    <div className="flex min-h-dvh w-full flex-col items-center gap-10 py-20 pt-24">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6">
          <h3>Add new Office/Institution</h3>
          <small className="text-muted-foreground mt-2">
            Create a new institution for the system
          </small>
        </div>

        <Separator className="mb-8" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="office_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter office name"
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
                name="department_or_ministry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department / Ministry</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter department or ministry"
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
                name="office_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office Type</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter office type"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="office_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter office address"
                        {...field}
                        disabled={isSubmitting}
                        className="min-h-32"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter district"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="official_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Official Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter official email"
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
                name="office_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter phone number (optional)"
                        {...field}
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
              name="working_days"
              render={() => (
                <FormItem>
                  <FormLabel>Working Days</FormLabel>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {workingDaysOptions.map((day) => (
                      <FormField
                        key={day}
                        control={form.control}
                        name="working_days"
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
                {isSubmitting ? "Creating..." : "Create Institution"}
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

        {/* Existing Institutions */}
        <div className="w-full">
          <div className="mb-6">
            <h3>Existing Institutions</h3>
            <small className="text-muted-foreground mt-2">
              Institutions currently registered in the system
            </small>
          </div>

          {institutions.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              No institutions added yet.
            </p>
          ) : (
            <div className="space-y-4">
              {institutions.map((institution, index) => (
                <div key={institution.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex w-full flex-col gap-1">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <h4 className="">{institution.office_name}</h4>
                        </div>
                        <small className="text-muted-foreground !text-xs">
                          {institution.department_or_ministry} |{" "}
                          {institution.office_type}
                        </small>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4">
                        <div className="border-input rounded-lg border p-3">
                          <h5 className="font-medium">Address</h5>
                          <small className="text-muted-foreground">
                            {institution.office_address}, {institution.district}
                          </small>
                        </div>

                        <div className="border-input rounded-lg border p-3">
                          <h5 className="font-medium">Email</h5>
                          <small className="text-muted-foreground">
                            {institution.official_email}
                          </small>
                        </div>

                        {institution.office_phone && (
                          <div className="border-input rounded-lg border p-3">
                            <h5 className="font-medium">Phone</h5>
                            <small className="text-muted-foreground">
                              {institution.office_phone}
                            </small>
                          </div>
                        )}

                        <div className="border-input rounded-lg border p-3">
                          <h5 className="font-medium">Working Days</h5>
                          <small className="text-muted-foreground">
                            {Array.isArray(institution.working_days)
                              ? institution.working_days.join(", ")
                              : institution.working_days}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index !== institutions.length - 1 && <hr className="my-5" />}
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
