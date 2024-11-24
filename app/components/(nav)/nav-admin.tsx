"use client";

import { type LucideIcon } from "lucide-react";
import { redirect } from "next/navigation"; // Import redirect from next/navigation
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavAdmin({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon: LucideIcon;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Admin</SidebarGroupLabel>
      <SidebarMenu>
        {items.flatMap((item) => [
          (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <button
                  onClick={() => redirect(item.url)}
                  className="flex items-center space-x-2"
                >
                  <item.icon />
                  <span>{item.title}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ),
          ...(item.items?.map((subItem) => (
            <SidebarMenuItem key={subItem.title}>
              <SidebarMenuButton asChild tooltip={subItem.title}>
                <button
                  onClick={() => redirect(subItem.url)}
                  className="flex items-center space-x-2"
                >
                  <subItem.icon />
                  <span>{subItem.title}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )) || []),
        ])}
      </SidebarMenu>
    </SidebarGroup>
  );
}
