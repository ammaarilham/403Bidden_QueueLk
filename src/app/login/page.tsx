"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaApple, FaFacebookF, FaGoogle } from "react-icons/fa";
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
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Username or email is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const Page = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    console.log("Checking session...");

    fetch("http://localhost:5000/api/session", {
      credentials: "include", // send cookies
    })
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Session data:", data);
        if (data.loggedIn) {
          if (data.user.type === 1) {
            console.log("Redirecting to admin dashboard");
            router.push("/admin-dashboard");
          } else if (data.user.type === 2) {
            console.log("Redirecting to customer dashboard");
            router.push("/customer-dashboard");
          }
        } else {
          console.log("Not logged in");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, [router]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important to receive and send cookies automatically
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login successful!", {
          description: "Redirecting to dashboard...",
        });

        setTimeout(() => {
          if (data.type === 1) router.push("/admin-dashboard");
          else if (data.type === 2) router.push("/customer-dashboard");
        }, 1500);
      } else {
        toast.error("Login failed", {
          description: data.error || "Invalid username or password",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed", {
        description: "Network error. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
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
        <h3 className="mb-8">Login</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username or email"
                      {...field}
                      autoComplete="username"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <small className="text-muted-foreground">
                    Enter your username or email
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
                      autoComplete="current-password"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <small className="text-muted-foreground">
                    Enter your password
                  </small>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end text-sm">
              <Link href="#" className="underline">
                <small className="!text-xs">Forgot password?</small>
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Login"}
            </Button>
          </form>
        </Form>

        {/* Social login */}
        <div className="my-8 flex items-center gap-2">
          <hr className="border-input flex-grow" />
          <small className="text-muted-foreground whitespace-nowrap !text-xs">
            Or login with
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
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold">
              Sign up
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Page;
