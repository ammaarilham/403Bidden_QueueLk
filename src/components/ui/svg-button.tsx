import * as React from "react";
import { cn } from "@/lib/utils";
import { easeInOut, motion } from "framer-motion";

interface SvgButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: React.ReactNode;
}

const SvgButton = ({
  className,
  href,
  icon: Icon,
  children,
  ...props
}: SvgButtonProps) => {
  return (
    <a
      href={href}
      className={cn(
        "border-input bg-secondary hover:border-primary/50 group relative inline-flex flex-col items-start justify-end gap-2 overflow-hidden rounded-xl border p-4 text-sm font-semibold transition-all duration-300 ease-in-out",
        className
      )}
      {...props}
    >
      {children && (
        <span className="text-muted-foreground group-hover:text-foreground z-10 text-center text-base leading-tight transition-all duration-300 ease-in-out">
          {children}
        </span>
      )}
      <Icon className="text-primary absolute -right-16 -top-16 z-0 size-48 shrink-0" />
    </a>
  );
};

export { SvgButton };
