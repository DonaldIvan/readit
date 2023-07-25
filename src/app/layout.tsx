import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/Toaster";

export const metadata = {
  title: "Breadit",
  description: "A Reddit clone built with Next.js and TypeScript.",
};

const inter = Inter({ subsets: ["latin"] });

const Layout = ({ children }: AppWithChildrenProps) => {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-900 light antialiased",
        inter.className
      )}
    >
      <body className="min-h-screen pt-12 antialiased bg-slate-50">
        <Navbar />
        <div className="container h-full pt-12 mx-auto max-w-7xl">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
};

export default Layout;
