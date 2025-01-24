import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

// Replace with a list of allowed emails
const allowedEmails = [
  "juliuslavekonge@gmail.com",
  "lucasbarlach@gmail.com",
  "user2@example.com",
  "user3@example.com",
  "kanygladteknik@gmail.com",
];

export async function middleware(request: NextRequest) {

  const baseURL = process.env.NEXTAUTH_URL || "http://localhost:3000";


  const session = await auth();

  const path = request.nextUrl.pathname;
  // Allow access to `/login` without checks
  if (path === "/login" || path === "/api/signout") {
    if (session && path === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
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

  // Fetch user role from an API endpoint
  let userRole;
  try {
    const response = await fetch(`${baseURL}/api/users/role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: session.user.email }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user role");
    }

    const data = await response.json();
    userRole = data.role;
    
  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow access to `/admin/*` only for users with the role "admin"
  if (path.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/denied", request.url));
  }

  // Redirect "/" to "/vagtplan"
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/vagtplan", request.url));
  }

  // Allow request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};