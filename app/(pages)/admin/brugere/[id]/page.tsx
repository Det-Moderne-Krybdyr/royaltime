"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/types";

export default function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null); // To store unwrapped `id`
  const { toast } = useToast();
  const router = useRouter();

  // Unwrap `params` and extract `id`
  useEffect(() => {
    async function unwrapParams() {
      const unwrappedParams = await params; // Wait for the params Promise to resolve
      setId(unwrappedParams.id); // Set the `id` in state
    }

    unwrapParams();
  }, [params]);

  // Fetch user once `id` is available
  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) throw new Error("Failed to fetch user");
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to fetch user details",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, toast]);

  const handleSave = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error("Failed to save user");
      toast({ title: "Success", description: "User updated successfully" });
      router.push("/admin/brugere");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Rediger bruger</h1>
      <div className="space-y-4">
        <Input
          placeholder="Name"
          value={user?.name || ""}
          onChange={(e) => setUser({ ...user, name: e.target.value } as User)}
        />
        <Input
          placeholder="Email"
          value={user?.email || ""}
          onChange={(e) => setUser({ ...user, email: e.target.value } as User)}
        />
        <Input
          placeholder="Phone"
          value={user?.phone || ""}
          onChange={(e) => setUser({ ...user, phone: e.target.value } as User)}
        />
        <Input
          placeholder="Primary Position"
          value={user?.primary_position || ""}
          onChange={(e) =>
            setUser({ ...user, primary_position: e.target.value } as User)
          }
        />
        <Input
          placeholder="Secondary Position"
          value={user?.secoundary_position || ""}
          onChange={(e) =>
            setUser({ ...user, secoundary_position: e.target.value } as User)
          }
        />
        <Input
          placeholder="Hourly Wage"
          type="number"
          value={user?.hourly_wage?.toString() || ""}
          onChange={(e) =>
            setUser({ ...user, hourly_wage: parseFloat(e.target.value) } as User)
          }
        />
        <Input
          placeholder="Sick Hourly Wage"
          type="number"
          value={user?.sick_hourly_wage?.toString() || ""}
          onChange={(e) =>
            setUser({
              ...user,
              sick_hourly_wage: parseFloat(e.target.value),
            } as User)
          }
        />
        <select
          className="border p-2 rounded"
          value={user?.role || "user"}
          onChange={(e) =>
            setUser({
              ...user,
              role: e.target.value as "user" | "admin",
            } as User)
          }
        >
          <option value="user">Bruger</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="flex justify-end mt-4 space-x-2">
        <Button variant="outline" onClick={() => router.push("/admin/brugere")}>
          Tilbage
        </Button>
        <Button onClick={handleSave}>Gem</Button>
      </div>
    </div>
  );
}
