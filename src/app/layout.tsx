import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/Toaster";
import { ReactNode } from "react";

export const metadata = {
  title: "Breadit",
  description: "A Reddit clone built with Next.js and TypeScript.",
};

const inter = Inter({ subsets: ["latin"] });

interface LayoutProps extends AppWithChildrenProps {
  authModal: ReactNode;
}

const Layout = ({
  children,
  authModal,
}: {
  children: ReactNode;
  authModal: ReactNode;
}) => {
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
        {authModal}
        <div className="container h-full pt-12 mx-auto max-w-7xl">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
};

export default Layout;
