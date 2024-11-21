import { signOutAction } from "@/lib/signOutAction"; // Use your signOut logic here

export async function POST() {
  // Call the sign-out action here
  await signOutAction(); // Perform the necessary server-side logic (e.g., invalidate session)

  // The redirect is handled inside the signOutAction function
}
