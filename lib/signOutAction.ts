import { signOut } from "@/auth";
import { NextResponse } from "next/server";

export async function signOutAction() {
  "use server";
  await signOut({ redirectTo: '/login' });

  // Clear session cookie or JWT token here
  const response = NextResponse.redirect("/login");

  // Example: Clear a session cookie (if applicable)
  response.cookies.delete('sessionId');  // Adjust based on your session management
  
  return response;
}
