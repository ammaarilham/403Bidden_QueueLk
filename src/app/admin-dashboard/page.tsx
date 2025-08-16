"use client";

import { ChartLineDefault } from "@/components/custom/chart-line-default";
import { SvgButton } from "@/components/ui/svg-button";
import {
  Server,
  Settings,
  UserCheck2Icon,
  Users,
  Wrench
} from "lucide-react";

const Page = () => {
  return (
    <>
      <div className="items- flex min-h-dvh w-full flex-col gap-10 py-20">
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
            href="/admin-dashboard/users"
            icon={UserCheck2Icon}
            className="col-span-1 h-40"
          >
            Manage Users
          </SvgButton>
          <SvgButton
            href="/admin-dashboard/institutions"
            icon={Server}
            className="col-span-1 h-40"
          >
            Add Institution{" "}
          </SvgButton>
          <SvgButton
            href="/inquiries"
            icon={Wrench}
            className="col-span-2 h-40"
          >
            Support & Inquiries
          </SvgButton>
        </div>

        <ChartLineDefault />
      </div>
    </>
  );
};

export default Page;
