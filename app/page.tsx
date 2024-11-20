import React from "react";
import prisma from "@/lib/db"; // Import Prisma client

// Define your User type
interface User {
  id: number;
  name: string | null;  // Allow name to be null
  email: string;
}

// This function fetches the users server-side
const fetchUsers = async (): Promise<User[]> => {
  try {
    const users = await prisma.user.findMany(); // Fetch data from the database
    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return []; // Return empty array if there's an error
  }
};

// Define the page component
export default async function Page() {
  const users = await fetchUsers(); // Fetch the users data

  return (
    <div>
      {/* Render users directly in the page */}
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))
        ) : (
          <li>No users found</li>
        )}
      </ul>
    </div>
  );
}
