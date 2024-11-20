// app/api/signout/route.ts

import { signOutAction } from "@/lib/signOutAction"; // Use your signOut logic here

export async function POST() {
  // Call the sign-out action here
  await signOutAction(); // Perform the necessary server-side logic (e.g., invalidate session)

  // Respond to the client
  return new Response(null, { status: 200 });
}
