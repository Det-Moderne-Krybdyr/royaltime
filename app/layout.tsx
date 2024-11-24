"use client";

import { usePathname } from "next/navigation";
import "./globals.css";

import { AppSidebar } from "@/app/components/(nav]/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Render children directly without layout for `/login`
  if (pathname === "/login") {
    return <html><body>{children}</body></html>;
  }

  return (
    <html lang="en">
      <body>
        <main>
        <SessionProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                </div>
              </header>
              <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
            </SidebarInset>
          </SidebarProvider>
          </SessionProvider>
        </main>
      </body>
    </html>
  );
}
