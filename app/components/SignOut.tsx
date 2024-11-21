"use client";

import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    // Call the sign-out API route
    const response = await fetch("/api/signout", {
      method: "POST",
    });

    // If the sign out is successful, redirect to login
    if (response.ok) {
      router.push("/login");
    }
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}
