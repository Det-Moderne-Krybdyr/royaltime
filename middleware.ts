import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

// Replace with a list of allowed emails
const allowedEmails = [
  "juliuslavekonge@gmail.com",
  "lucasbarlach@gmail.com",
  "user2@example.com",
  "user3@example.com",
];

export async function middleware(request: NextRequest) {
  const session = await auth();

  console.log(session?.user?.id);
  console.log(session?.user?.name);
  console.log(session?.user?.email);
  console.log(session?.user?.image);

  const path = request.nextUrl.pathname;
  // Allow access to `/login` without checks
  if (path === "/login" || path === "/api/signout") {
    return NextResponse.next();
  }

  // Redirect to `/login` if no session or invalid email
  if (
    !session ||
    !session.user ||
    !session.user.email ||
    !allowedEmails.includes(session.user.email)
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
