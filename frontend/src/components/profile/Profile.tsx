/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, authHeaders } from "@/lib/api";
import { clearToken, getToken } from "@/utils/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

// --- Type Definitions ---
interface Document {
  id: number;
  filename: string;
  extracted_text: string;
}

interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  vendor_name: string;
  transaction_date: string;
}

interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  documents: Document[];
  transactions: Transaction[];
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // --- Fetch user profile ---
  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    (async () => {
      try {
        const data = await apiFetch<User>("/api/v1/users/me", {
          headers: authHeaders(token),
        });
        setUser(data);
      } catch (err: any) {
        console.error("Failed to load profile:", err);
        setError(err.message || "Failed to fetch user profile");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [router]);

  // --- Logout handler ---
  const handleLogout = () => {
    clearToken();
    router.push("/");
  };

  if (isLoading) return <ProfileSkeleton />;

  if (error) {
    return (
      <Card className="w-full max-w-lg bg-red-100/30 dark:bg-red-900/30 backdrop-blur-lg shadow-xl border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-800 dark:text-red-300">
            Error
          </CardTitle>
          <CardDescription className="text-red-700 dark:text-red-400">
            {error}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end">
          <Button onClick={handleLogout} variant="outline">
            Log Out
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!user) return null;

  const userInitials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Card className="w-full max-w-lg bg-white/30 dark:bg-black/30 backdrop-blur-lg shadow-xl border-white/20 dark:border-black/20">
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.full_name}`}
            alt={user.full_name}
          />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <CardTitle className="text-2xl text-gray-800 dark:text-gray-100">
            {user.full_name}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {user.email}
          </CardDescription>
        </div>
        <Badge
          variant={user.is_active ? "default" : "destructive"}
          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700"
        >
          {user.is_active ? "Active" : "Inactive"}
        </Badge>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="transactions">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="mt-4">
            <TransactionTable transactions={user.transactions} />
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <DocumentList documents={user.documents} />
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={handleLogout}>
          Log Out
        </Button>
      </CardFooter>
    </Card>
  );
}

// --- Sub-components for better organization ---
const TransactionTable = ({ transactions }: { transactions: Transaction[] }) => (
  <div className="rounded-md border border-white/20 dark:border-black/20 max-h-60 overflow-y-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length > 0 ? (
          transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-medium">{tx.description}</TableCell>
              <TableCell>{tx.category}</TableCell>
              <TableCell
                className={`text-right ${
                  tx.amount > 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-500"
                }`}
              >
                {tx.amount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "INR",
                })}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-gray-500">
              No transactions found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);

const DocumentList = ({ documents }: { documents: Document[] }) => (
  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
    {documents.length > 0 ? (
      documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-3 rounded-md border border-white/20 dark:border-black/20 bg-white/20 dark:bg-black/20"
        >
          <p className="text-sm font-medium">{doc.filename}</p>
          <Button variant="ghost" size="sm">
            View
          </Button>
        </div>
      ))
    ) : (
      <p className="text-center text-gray-500">No documents uploaded yet</p>
    )}
  </div>
);

const ProfileSkeleton = () => (
  <Card className="w-full max-w-lg bg-white/30 dark:bg-black/30 backdrop-blur-lg shadow-xl border-white/20 dark:border-black/20">
    <CardHeader className="flex flex-row items-center space-x-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2 flex-grow">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-52" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex space-x-2">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-10 w-1/2" />
      </div>
      <Skeleton className="h-32 w-full" />
    </CardContent>
    <CardFooter className="flex justify-end">
      <Skeleton className="h-10 w-24" />
    </CardFooter>
  </Card>
);
