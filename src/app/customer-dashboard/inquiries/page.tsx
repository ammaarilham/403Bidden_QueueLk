"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import SuccessRedirectPage from "@/components/shared/SuccessRedirectPage";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  inquiry: z
    .string()
    .min(1, "Inquiry is required")
    .min(10, "Inquiry must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const Page = () => {
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      inquiry: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/add-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Inquiry submitted successfully!", {
          description: "You will receive an SMS with the details.",
        });
        setSuccess(true);
      } else {
        toast.error("Submission failed", {
          description: data.error || "Something went wrong.",
        });
      }
    } catch (err) {
      console.error("Error submitting inquiry:", err);
      toast.error("Submission failed", {
        description: "A network error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <SuccessRedirectPage
        title="Inquiry sent successfully!"
        message="You will receive an SMS with the details..."
        showButton={true}
        buttonText="Go to Inquiries"
        buttonHref="/customer-dashboard/inquiries"
        redirectUrl="/customer-dashboard/inquiries"
        redirectDelay={1500}
      />
    );
  }

  return (
    <div className="flex min-h-dvh w-full flex-col items-center gap-10 py-20 pt-24">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6">
          <h3>Submit an Inquiry</h3>
          <small className="text-muted-foreground mt-2">
            Have a question or need assistance? Send us your inquiry and we'll
            get back to you.
          </small>
        </div>

        <Separator className="mb-6" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
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
              name="inquiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Inquiry</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe your inquiry in detail..."
                      className="min-h-32 resize-none"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-0">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Inquiry"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting}
              >
                Clear Form
              </Button>
            </div>
          </form>
        </Form>

        <div className="bg-muted/50 mt-8 rounded-lg p-4">
          <h3 className="mb-2 font-medium">What happens next?</h3>
          <ul className="text-muted-foreground space-y-1 text-sm">
            <li>
              • You'll receive an SMS confirmation with your inquiry details
            </li>
            <li>• Our team will review your inquiry within 24 hours</li>
            <li>• We'll contact you via email or phone with a response</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page;
