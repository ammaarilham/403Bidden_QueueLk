"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Link from "next/link";

const formSchema = z
  .object({
    username: z.string().min(3, {
      message: "Username must be at least 3 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(1, {
      message: "Please confirm your password.",
    }),
    termsAccepted: z.boolean().refine((value) => value === true, {
      message: "You must accept the terms and conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

const Page = () => {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        await Swal.fire({
          icon: "success",
          title: "Signup successful!",
          text: "You will be redirected to the login page.",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        router.push("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Signup failed",
          text: data.error || "Something went wrong.",
        });
      }
    } catch (err) {
      console.error("Error signing up:", err);
      Swal.fire({
        icon: "error",
        title: "Signup failed",
        text: "A network error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center py-20">
      <Image
        height={80}
        width={95}
        src="/assets/branding/icon.svg"
        alt="Queue.lk logo"
        className="mb-10 size-24 cursor-pointer"
      />

      <div className="w-full max-w-md">
        <h3 className="mb-8">Sign up</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      {...field}
                      autoComplete="username"
                    />
                  </FormControl>
                  <small className="text-muted-foreground">
                    Enter your username
                  </small>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      autoComplete="email"
                    />
                  </FormControl>
                  <small className="text-muted-foreground">
                    Enter your email
                  </small>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <small className="text-muted-foreground">
                    Enter your password
                  </small>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password again"
                      {...field}
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <small className="text-muted-foreground">
                    Confirm your password
                  </small>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="bg-primary/10 flex flex-row items-start space-x-1 space-y-0 rounded-sm p-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="bg-background"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-primary-foreground text-sm leading-snug">
                      You have read & accepted our terms & conditions.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Sign up
            </Button>
          </form>
        </Form>

        {/* Social login */}
        <div className="my-8 flex items-center gap-2">
          <hr className="border-input flex-grow" />
          <small className="text-muted-foreground whitespace-nowrap !text-xs">
            Or register with
          </small>
          <hr className="border-input flex-grow" />
        </div>

        <div className="mb-10 flex justify-center gap-2">
          {[FaGoogle, FaApple, FaFacebookF].map((Icon, i) => (
            <button
              key={i}
              type="button"
              className="border-input flex w-full cursor-not-allowed justify-center rounded-xl border p-3 text-center transition-transform hover:scale-[1.01]"
            >
              <Icon className="size-5" />
            </button>
          ))}
        </div>

        <div className="w-full text-center">
          <small className="!font-normal">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold">
              Log in
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Page;
