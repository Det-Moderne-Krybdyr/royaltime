"use client";

import * as React from "react";
import {
  CalendarDays,
  Plane,
  User,
  Settings,
  Crown,
  Users,
} from "lucide-react";

import { NavMain } from "@/app/components/(nav)/nav-main";
import { NavUser } from "@/app/components/(nav)/nav-user";
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
import { NavAdmin } from "./nav-admin";

const data = {
  navMain: [
    { title: "Vagtplan", url: "/vagtplan", icon: CalendarDays },
    { title: "Ferieplan", url: "/ferieplan", icon: Plane },
    { title: "Min profil", url: "/min-profil", icon: User },
  ],
  navAdmin: [
    { title: "Vagtplan", url: "/admin/vagtplan", icon: CalendarDays },
    { title: "Ferieplan", url: "/admin/ferieplan", icon: Plane },
    { title: "Brugere", url: "/admin/brugere", icon: Users  },
    { title: "Indstillinger", url: "/admin/indstillinger", icon: Plane },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const fetchUserRole = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/users/role", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: session.user.email }),
          });

          if (!response.ok) {
            console.error("Failed to fetch user role:", response.statusText);
            return;
          }

          const { role } = await response.json();
          if (role === "admin") {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };

    fetchUserRole();
  }, [session?.user?.email]);

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
        <NavMain items={data.navMain} />
        {isAdmin && <NavAdmin items={data.navAdmin} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
