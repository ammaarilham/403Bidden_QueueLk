"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IdCard, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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

const formSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    full_name: z.string().min(1, "Full name is required"),
    official_title: z.string().min(1, "Official title is required"),
    employee_id: z.string().min(1, "Employee ID is required"),
    official_email: z.string().email("Please enter a valid email address"),
    mobile_number: z.string().min(1, "Mobile number is required"),
    alternative_contact: z.string().optional(),
    registered_institution: z
      .string()
      .min(1, "Registered institution is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type FormValues = z.infer<typeof formSchema>;

interface AdminUser {
  id: number;
  username: string;
  full_name: string;
  official_title: string;
  employee_id: string;
  email: string;
  mobile_number: string;
  alternative_contact?: string;
  registered_institution: string | number;
  institution_name?: string;
  role?: number;
}

const Page = () => {
  const [success, setSuccess] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      full_name: "",
      official_title: "",
      employee_id: "",
      official_email: "",
      mobile_number: "",
      alternative_contact: "",
      registered_institution: "",
      password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/fetch_admin_records")
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []))
      .catch((err) => {
        console.error("Error fetching users:", err);
        toast.error("Failed to load admin records");
      })
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/admin-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          fullName: values.full_name,
          officialTitle: values.official_title,
          employeeId: values.employee_id,
          officialEmail: values.official_email,
          mobileNumber: values.mobile_number,
          alternativeContact: values.alternative_contact,
          registeredInstitution: values.registered_institution,
          password: values.password,
          confirmPassword: values.confirm_password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Admin access created successfully!", {
          description: "The new admin user has been added to the system.",
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
          <p className="text-muted-foreground">Loading admin records...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <SuccessRedirectPage
        title="Admin Access Created Successfully!"
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
          <h3>Manage Admin Access</h3>
          <small className="text-muted-foreground mt-2">
            Create new admin user accounts for the system
          </small>
        </div>

        <Separator className="mb-8" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter username"
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
            </div>

            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="official_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Official Title / Position</FormLabel>
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

              <FormField
                control={form.control}
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee ID / Service Number</FormLabel>
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

            <div className="grid grid-cols-1 gap-6">
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
                        placeholder="Enter alternative contact (optional)"
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

            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
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
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm password"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Admin Access"}
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

        {/* Existing Users */}
        <div className="w-full">
          <div className="mb-6">
            <h3>Existing Users (Admin)</h3>
            <small className="text-muted-foreground mt-2">
              Admin users currently registered in the system
            </small>
          </div>

          {users.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              No admin users found.
            </p>
          ) : (
            <div className="space-y-4">
              {users.map((user, index) => (
                <div key={user.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <h4 className="">
                            {user.full_name} ({user.username})
                          </h4>
                        </div>
                        <small className="text-muted-foreground flex items-center gap-1">
                          <IdCard className="size-4" />
                          {user.official_title}
                        </small>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        {user.email && (
                          <div className="border-input rounded-lg border p-3">
                            <h5 className="font-medium">Email</h5>
                            <small className="text-muted-foreground">
                              {user.email}
                            </small>
                          </div>
                        )}

                        {user.mobile_number && (
                          <div className="border-input rounded-lg border p-3">
                            <h5 className="font-medium">Mobile</h5>
                            <small className="text-muted-foreground">
                              {user.mobile_number}
                            </small>
                          </div>
                        )}

                        {user.alternative_contact && (
                          <div className="border-input rounded-lg border p-3">
                            <h5 className="font-medium">Alternative Contact</h5>
                            <small className="text-muted-foreground">
                              {user.alternative_contact}
                            </small>
                          </div>
                        )}

                        {(user.institution_name ||
                          user.registered_institution) && (
                          <div className="border-input rounded-lg border p-3">
                            <h5 className="font-medium">Institution</h5>
                            <small className="text-muted-foreground">
                              {user.institution_name ||
                                user.registered_institution}
                            </small>
                          </div>
                        )}

                        {user.role && (
                          <div className="border-input rounded-lg border p-3">
                            <h5 className="font-medium">Role</h5>
                            <small className="text-muted-foreground">
                              {user.role === 1
                                ? "Admin"
                                : user.role === 2
                                  ? "Customer"
                                  : "Unknown"}
                            </small>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {index !== users.length - 1 && <hr className="my-5" />}
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
