"use client";
import { useState, FormEvent } from 'react';
// Assuming these are defined in your project
// import { apiFetch, authHeaders } from '@/lib/api'; 

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
    // Simulate a successful login
    if (url.includes('/api/v1/login/token')) {
        return new Promise(resolve => setTimeout(() => resolve({ access_token: 'mock_token_12345', token_type: 'bearer' } as T), 1000));
    }
    // Simulate an error
    return Promise.reject(new Error("Invalid credentials. Please try again."));
};

const authHeaders = (token?: string, contentType: string = 'application/json') => {
    const headers = new Headers();
    headers.append('Content-Type', contentType);
    if (token) {
        headers.append('Authorization', `Bearer ${token}`);
    }
    return headers;
};


export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // The useRouter hook from next/navigation is removed as it's causing an error in this environment.
  // In a real Next.js app, this would work as expected.

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    try {
      const data = await apiFetch<{ access_token: string; token_type: string }>(
        '/api/v1/login/token',
        {
          method: 'POST',
          headers: authHeaders(undefined, 'application/x-www-form-urlencoded'),
          body: params.toString()
        }
      );
      // In a real app, you'd store this token securely
      // localStorage.setItem('access_token', data.access_token);
      console.log("Login successful, token:", data.access_token);
      // Simulating navigation since useRouter is not available here.
      alert("Login successful! Redirecting to dashboard...");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    // Card component with glass morphism effect
    // It uses a semi-transparent background and a backdrop blur filter
    <Card className="w-full max-w-md bg-white/30 dark:bg-black/30 backdrop-blur-lg shadow-xl border-white/20 dark:border-black/20">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Welcome Back 👋
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400 pt-2">
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}