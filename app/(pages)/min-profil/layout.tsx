"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function MinProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Define menu items
  const menuItems = [
    { label: "Vagter", path: "/min-profil/vagter" },
    { label: "Ferieplan", path: "/min-profil/ferieplan" },
    { label: "Indstillinger", path: "/min-profil/indstillinger" },
    { label: "Notifikationer", path: "/min-profil/notifikationer" },
  ];

  const handleMenuClick = (path: string) => {
    router.push(path);
  };

  return (
    <div>
      {/* SubMenu */}
      <header className="border-b p-4 bg-gray-50">
        <div className="flex justify-center space-x-4">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className="hover:underline"
              onClick={() => handleMenuClick(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </header>

      {/* Page Content */}
      <main className="mt-8 p-4">{children}</main>
    </div>
  );
}
