"use client";

import { Button } from "@/components/ui/button";
import { SvgButton } from "@/components/ui/svg-button";
import {
  ArrowRight,
  ClockAlert,
  Headphones,
  MailSearch,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Booking {
  booking_number: number;
  item_name: string;
  booking_date: string;
  created_at: string;
  office?: string; // optional, if you want to display location
}

const Page = () => {
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  const router = useRouter();

  useEffect(() => {
    // Fetch recent bookings (latest 3)
    fetch("http://localhost:5000/api/fetch-bookings?limit=6", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setRecentBookings(data.bookings || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <div className="flex min-h-dvh w-full flex-col items-center gap-10 py-20">
        <div className="grid w-full grid-cols-2 gap-2">
          <SvgButton
            href="/customer-dashboard/bookings"
            icon={MailSearch}
            className="col-span-1 h-40"
          >
            Queue Booking
          </SvgButton>
          <SvgButton
            href="/customer-dashboard/inquiries"
            icon={Headphones}
            className="col-span-1 h-40"
          >
            Inquiries
          </SvgButton>
          <SvgButton
            href="/customer-dashboard/inquiries"
            icon={Wrench}
            className="col-span-2 h-40"
          >
            Support & Inquiries
          </SvgButton>
        </div>

        <div className="w-full">
          <h3 className="mb-5">Recent Activities</h3>

          {recentBookings.length === 0 ? (
            <p className="text-muted-foreground">No recent bookings found.</p>
          ) : (
            recentBookings.map((b) => (
              <div key={b.booking_number}>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="bg-primary/25 text-primary-foreground mb-2 w-fit rounded-full px-2.5 py-0.5 text-xs font-medium">
                      Booking #{b.booking_number}
                    </span>
                    <h4 className="">{b.item_name}</h4>
                    <small className="text-muted-foreground">
                      {new Date(b.booking_date).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </small>
                    {b.office && (
                      <small className="text-muted-foreground !text-xs">
                        {b.office}
                      </small>
                    )}
                  </div>
                  <ClockAlert className="text-muted-foreground" />
                </div>
                <hr className="my-5" />
              </div>
            ))
          )}

          <div className="pt-4 text-center">
            <Button variant={"secondary"} asChild className="">
              <Link href="/customer-dashboard/bookings">
                <span>See all bookings</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
