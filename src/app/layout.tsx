import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Queue.lk",
  description: "Effortless Booking, No More Waiting",
  authors: [
    { name: "Ammaar ilham", url: "https://ammaarilham.dev" },
    { name: "Thilina R. (Edward Hyde)", url: "https://thilina.dev" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-background text-foreground relative h-full antialiased",
          inter.className
        )}
      >
        <main className="sm:border-input relative mx-auto flex min-h-screen max-w-sm flex-col sm:border-x px-5">
          <div className="flex-1 flex-grow">{children}</div>
        </main>
      </body>
    </html>
  );
}
