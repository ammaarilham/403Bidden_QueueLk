"use client";

import { ChartLineDefault } from "@/components/custom/chart-line-default";
import { Button } from "@/components/ui/button";
import { SvgButton } from "@/components/ui/svg-button";
import { Settings, ToolCase, Users } from "lucide-react";
import Link from "next/link";

const Page = () => {
  return (
    <>
      <div className="flex min-h-dvh w-full flex-col items-center py-20">
        <div className="grid w-full grid-cols-2 gap-2">
          <SvgButton
            href="/admin-dashboard/services"
            icon={Settings}
            className="col-span-1 h-40"
          >
            Add Services
          </SvgButton>
          <SvgButton
            href="/admin-dashboard/events"
            icon={Users}
            className="col-span-1 h-40"
          >
            Add Event
          </SvgButton>
          <SvgButton
            href="/inquiries"
            icon={ToolCase}
            className="col-span-2 h-40"
          >
            Support
          </SvgButton>
        </div>

        <div className="my-5">
          <Link href="/admin-dashboard/users">
            <Button variant={"outline"}>Manage Users</Button>
          </Link>
        </div>

        <ChartLineDefault />
      </div>
    </>
  );
};

export default Page;
