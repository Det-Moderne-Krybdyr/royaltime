import { signOut } from "@/auth";
import { NextResponse } from "next/server";

export async function signOutAction() {
  "use server";
  await signOut();

  // Redirect to /login after signing out
  return NextResponse.redirect("/login");
}
