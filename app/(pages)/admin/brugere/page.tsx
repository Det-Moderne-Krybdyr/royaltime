"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types";
import { useRouter } from "next/navigation";

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Partial<User>>({
    id: "",
    name: "",
    email: "",
    phone: "",
    employment_date: new Date().toISOString(),
    primary_position: "",
    secoundary_position: "",
    prio_list: "",
    salary_number: "",
    hourly_wage: 0,
    sick_hourly_wage: 0,
    role: "user", // Default to "user"
  });
  const { toast } = useToast();
  const router = useRouter();

  // Fetch all users (memoized)
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error("Failed to add user");
      toast({ title: "Success", description: "User added successfully" });
      fetchUsers();
      setNewUser({
        id: "",
        name: "",
        email: "",
        phone: "",
        employment_date: new Date().toISOString(),
        primary_position: "",
        secoundary_position: "",
        prio_list: "",
        salary_number: "",
        hourly_wage: 0,
        sick_hourly_wage: 0,
        role: "user",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");
      toast({ title: "Success", description: "User deleted successfully" });
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold">Bruger kontrol</h1>
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <Input
            placeholder="Name"
            value={newUser.name || ""}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={newUser.email || ""}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <Input
            placeholder="Phone"
            value={newUser.phone || ""}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
          />
          <Input
            placeholder="Primary Position"
            value={newUser.primary_position || ""}
            onChange={(e) =>
              setNewUser({ ...newUser, primary_position: e.target.value })
            }
          />
          <Input
            placeholder="Secondary Position"
            value={newUser.secoundary_position || ""}
            onChange={(e) =>
              setNewUser({ ...newUser, secoundary_position: e.target.value })
            }
          />
          <Input
            placeholder="Hourly Wage"
            type="number"
            value={newUser.hourly_wage?.toString() || ""}
            onChange={(e) =>
              setNewUser({ ...newUser, hourly_wage: parseFloat(e.target.value) })
            }
          />
          <Input
            placeholder="Sick Hourly Wage"
            type="number"
            value={newUser.sick_hourly_wage?.toString() || ""}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                sick_hourly_wage: parseFloat(e.target.value),
              })
            }
          />
          <select
            className="border p-2 rounded"
            value={newUser.role || "user"}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                role: e.target.value as "user" | "admin",
              })
            }
          >
            <option value="user">Bruger</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <Button onClick={handleAddUser}>Tilføj bruger</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Navn</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead>Primær Stilling</TableHead>
            <TableHead>Sekundær Stilling</TableHead>
            <TableHead>Løn</TableHead>
            <TableHead>Sygeløn</TableHead>
            <TableHead>Rolle</TableHead>
            <TableHead>Handling</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.primary_position}</TableCell>
              <TableCell>{user.secoundary_position}</TableCell>
              <TableCell>{user.hourly_wage}</TableCell>
              <TableCell>{user.sick_hourly_wage}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/admin/brugere/${user.id}`)}
                >
                  Rediger
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Slet
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
