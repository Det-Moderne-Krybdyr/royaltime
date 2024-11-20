'use client';

import { useState } from 'react';

export default function AccountPage() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUser(null);

    try {
      const response = await fetch('/api/getUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch {
      setError('Failed to fetch user. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={fetchUser} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your email"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Fetch Account
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {user && (
        <div className="mt-4 p-4 border rounded-md">
          <h3 className="text-lg font-bold">Account Details:</h3>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Name:</strong> {user.name}</p>
        </div>
      )}
    </div>
  );
}
