import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Template-NEXT",
  description:
    "A clean Next.js template with TypeScript, TailwindCSS, Shadcn/ui, and Prettier, developed by Thilina Rathnayaka (A.K.A Edward Hyde). Optimized for quick project setup with handy packages.",
  keywords: ["Next.js", "TypeScript", "TailwindCSS", "Shadcn/ui", "Template"],
  authors: [{ name: "Thilina R. (Edward Hyde)", url: "https://thilina.dev" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn("relative h-full antialiased", inter.className)}
      >
        <main className="relative flex min-h-screen flex-col">
          <div className="flex-1 flex-grow">{children}</div>
        </main>
      </body>
    </html>
  );
}