"use client";

import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    // Call the sign-out API route
    const response = await fetch("/api/signout", {
      method: "POST",
    });

    if (response.ok) {
      // Redirect the user after sign-out (e.g., to the login page)
      router.push("/login");
    } else {
      // Handle any error that occurs during sign-out
      console.error("Sign-out failed");
    }
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}
