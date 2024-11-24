"use client";

import * as React from "react";
import {
  CalendarDays,
  Plane,
  User,
  Settings,
  Crown,
} from "lucide-react";

import { NavMain } from "@/app/components/(nav]/nav-main";
import { NavUser } from "@/app/components/(nav]/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useSession } from "next-auth/react";

const data = {
  navMain: [
    { title: "Vagtplan", url: "/vagtplan", icon: CalendarDays }, // A calendar icon for schedules
    { title: "Ferieplan", url: "/ferieplan", icon: Plane }, // A plane icon for vacation plans
    { title: "Min profil", url: "/min-profil", icon: User }, // A user icon for profile
    { title: "Indstillinger", url: "/indstillinger", icon: Settings }, // A settings icon for configuration
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession(); // Get session data

  // Provide fallback values for user data
  const user = {
    name: session?.user?.name || "Guest User",
    email: session?.user?.email || "guest@example.com",
    image: session?.user?.image || "/avatars/default.jpg",
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Crown color="#ffc800" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Konge Software</span>
                  <span className="truncate text-xs">Udvikling</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Pass the flattened navMain items */}
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} /> {/* Use session-based user data */}
      </SidebarFooter>
    </Sidebar>
  );
}
