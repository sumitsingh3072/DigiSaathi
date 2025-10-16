"use client";
import { useState, FormEvent } from 'react';
// Assuming 'next/navigation' is available in your project environment
// import { useRouter } from 'next/navigation'; 

// Shadcn UI Components - Assuming these are available in your project.
// If not, you'd need to install them: `npx shadcn-ui@latest add button card input label`
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock API functions for demonstration since I don't have access to your lib
const apiFetch = async <T,>(url: string, options: RequestInit): Promise<T> => {
    console.log("Fetching API:", url, options);
    // Simulate a successful registration
    if (url.includes('/api/v1/users/')) {
        return new Promise(resolve => setTimeout(() => resolve({} as T), 1000));
    }
    // Simulate an error
    return Promise.reject(new Error("An account with this email already exists."));
};

const authHeaders = (token?: string, contentType: string = 'application/json') => {
    const headers = new Headers();
    headers.append('Content-Type', contentType);
    if (token) {
        headers.append('Authorization', `Bearer ${token}`);
    }
    return headers;
};


export default function RegisterForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // The useRouter hook from next/navigation is removed as it's causing an error in this environment.
  // In a real Next.js app, this would work as expected.
  // const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await apiFetch('/api/v1/users/', {
        method: 'POST',
        headers: authHeaders(undefined, 'application/json'),
        body: JSON.stringify({ full_name: fullName, email, password })
      });
      // Simulating navigation since useRouter is not available here.
      alert("Registration successful! You can now log in.");
      // router.push('/login');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md bg-white/30 dark:bg-black/30 backdrop-blur-lg shadow-xl border-white/20 dark:border-black/20">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Create an Account 🛡️
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400 pt-2">
          Enter your details below to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                disabled={isLoading}
                className="bg-white/50 dark:bg-black/50"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="bg-white/50 dark:bg-black/50"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="bg-white/50 dark:bg-black/50"
                />
            </div>
            {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
        </form>
      </CardContent>
    </Card>
  );
}

