"use client";

import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    const response = await fetch("/api/signout", {
      method: "POST",
    });

    if (response.ok) {
      // Use router.push to redirect to /login
      router.push("/login");
    } else {
      console.error("Failed to sign out");
    }
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}
