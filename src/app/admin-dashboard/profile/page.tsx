"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Eye, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import * as z from "zod";

import SuccessRedirectPage from "@/components/shared/SuccessRedirectPage";
import { Button } from "@/components/ui/button";
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
import Image from "next/image";

const formSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  official_title: z.string().min(1, "Official title is required"),
  employee_id: z.string().min(1, "Employee ID is required"),
  official_email: z.string().email("Invalid email address"),
  mobile_number: z.string().min(1, "Mobile number is required"),
  alternative_contact: z.string().optional(),
  registered_institution: z
    .string()
    .min(1, "Registered institution is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface User {
  username: string;
  full_name: string;
  official_title: string;
  employee_id: string;
  official_email: string;
  mobile_number: string;
  alternative_contact?: string;
  registered_institution: string;
  profile_picture?: string;
  nic_document?: string;
  birth_certificate_document?: string;
  driving_license_document?: string;
  other_document1?: string;
  other_document2?: string;
  other_document3?: string;
}

const Page = () => {
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [bookingCount, setBookingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      official_title: "",
      employee_id: "",
      official_email: "",
      mobile_number: "",
      alternative_contact: "",
      registered_institution: "",
    },
  });

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/profile", { credentials: "include" }),
      fetch("http://localhost:5000/api/bookings-count", {
        credentials: "include",
      }),
    ])
      .then(async ([profileRes, bookingRes]) => {
        const profileData = await profileRes.json();
        const bookingData = await bookingRes.json();

        if (profileData.user) {
          setUser(profileData.user);
          form.reset({
            full_name: profileData.user.full_name || "",
            official_title: profileData.user.official_title || "",
            employee_id: profileData.user.employee_id || "",
            official_email: profileData.user.official_email || "",
            mobile_number: profileData.user.mobile_number || "",
            alternative_contact: profileData.user.alternative_contact || "",
            registered_institution:
              profileData.user.registered_institution || "",
          });
        }

        setBookingCount(bookingData.count || 0);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        toast.error("Failed to load profile data");
      })
      .finally(() => setLoading(false));
  }, [form]);

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    const formData = new FormData();

    // Add form values
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value || "");
    });

    // Handle file uploads
    const fileFields = [
      "profile_picture",
      "nic_document",
      "birth_certificate_document",
      "driving_license_document",
      "other_document1",
      "other_document2",
      "other_document3",
    ];

    fileFields.forEach((field) => {
      const input = document.querySelector(
        `input[name="${field}"]`
      ) as HTMLInputElement;

      if (input?.files?.[0]) {
        formData.append(field, input.files[0]);
      }
    });

    try {
      const res = await fetch("http://localhost:5000/api/profile/update", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully!", {
          description: "Your profile information has been saved.",
        });
        setSuccess(true);
      } else {
        toast.error("Update failed", {
          description: data.error || "Something went wrong.",
        });
      }
    } catch (err) {
      console.error(err);
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
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-muted-foreground">Failed to load profile data</p>
      </div>
    );
  }

  if (success) {
    return (
      <SuccessRedirectPage
        title="Profile Updated Successfully!"
        message=""
        showButton={true}
        buttonText="Go to Profile"
        buttonHref="/customer-dashboard/profile"
        redirectUrl="/customer-dashboard/profile"
        redirectDelay={1500}
      />
    );
  }

  const documentFields = [
    { name: "nic_document", label: "NIC Document" },
    { name: "birth_certificate_document", label: "Birth Certificate" },
    { name: "driving_license_document", label: "Driving License" },
    { name: "other_document1", label: "Other Document 1" },
    { name: "other_document2", label: "Other Document 2" },
    { name: "other_document3", label: "Other Document 3" },
  ];

  return (
    <div className="flex min-h-dvh w-full flex-col items-center gap-10 py-20 pt-24">
      {/* Header Stats */}
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6">
          <h3>Account Details</h3>
          <small className="text-muted-foreground mt-2">
            Manage your profile and documents
          </small>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-lg border px-2 py-3 text-center">
            <div className="border-input mx-auto mb-1.5 flex aspect-square size-[136px] items-center justify-center rounded-lg border">
              <QRCode
                value="http://localhost:3000/customer-dashboard/documents"
                size={120}
                level="H"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <QrCode className="h-4 w-4" />
                <span className="text-sm font-medium">QR Documents</span>
              </div>
              <small className="text-muted-foreground text-xs">
                Scan to view all documents
              </small>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-lg border px-2 py-3 text-center">
            <div className="mx-auto mb-1.5">
              <h1 className="border-primary/15 text-primary-foreground bg-primary/10 flex aspect-square size-[136px] items-center justify-center rounded-lg border">
                {bookingCount}
              </h1>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-medium">Bookings</span>
              </div>
              <small className="text-muted-foreground text-xs">
                Summary of your booking history
              </small>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Profile Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="">Personal Information</h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter full name"
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
                  name="official_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Official Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter official title"
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
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter employee ID"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="">Contact Information</h3>

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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="mobile_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter mobile number"
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
                  name="alternative_contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alternative Contact</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter alternative contact"
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
                name="registered_institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registered Institution</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter registered institution"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Profile Picture */}
            <div className="space-y-4">
              <h3 className="">Profile Picture</h3>

              {user.profile_picture && (
                <div className="flex items-center gap-4">
                  <Image
                    height={500}
                    width={500}
                    src={`/assets/images/profile_pictures/${user.profile_picture}`}
                    alt="Current profile"
                    className="border-input size-16 rounded-full border object-cover"
                  />
                  <div className="text-sm">
                    <p className="font-medium">Current profile picture</p>
                    <small className="text-muted-foreground">
                      Choose a new file to replace
                    </small>
                  </div>
                </div>
              )}

              <Input
                name="profile_picture"
                type="file"
                accept="image/*"
                className="file:bg-primary/10 file:text-primary hover:file:bg-primary/20 h-11 p-2 file:mr-4 file:rounded-full file:border-0 file:px-2.5 file:py-0 file:text-sm file:font-medium"
                disabled={isSubmitting}
              />
            </div>

            <Separator />

            {/* Documents */}
            <div className="space-y-4">
              <h3 className="">Documents</h3>

              <div className="flex flex-col gap-10">
                {documentFields.map(({ name, label }) => {
                  const currentDoc = user[name as keyof User] as string;
                  return (
                    <div key={name} className="flex flex-col gap-3">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {label} (PDF or Image)
                      </label>

                      {currentDoc && (
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a
                              href={`/assets/images/other_documents/${currentDoc}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2"
                            >
                              <Eye className="h-3 w-3" />
                              View Current File
                            </a>
                          </Button>
                        </div>
                      )}

                      <Input
                        name={name}
                        type="file"
                        accept="image/*,application/pdf"
                        className="file:bg-muted-foreground/10 file:text-muted-foreground hover:file:bg-muted-foreground/20 h-11 p-2 file:mr-4 file:rounded-full file:border-0 file:px-2.5 file:py-0 file:text-sm file:font-medium"
                        disabled={isSubmitting}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Profile"}
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
      </div>
    </div>
  );
};

export default Page;
