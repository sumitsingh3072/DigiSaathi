/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, authHeaders } from "@/lib/api";
import { getToken, clearToken } from "@/utils/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertTriangle,
  IndianRupee,
  ArrowUpRight,
  Send,
  ScanLine,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DashboardSummary from "@/components/dashboard/DashboardSummary";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  vendor_name: string;
  transaction_date: string;
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [userName, setUserName] = useState<string>("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    (async () => {
      try {
        // Fetch user profile to get transactions and name
        const userData = await apiFetch<any>("/api/v1/users/me", {
          headers: authHeaders(token),
        });

        setUserName(userData.full_name || "User");
        setTransactions(userData.transactions || []);

        // Optionally calculate current balance (if transactions have + and - amounts)
        const total = userData.transactions?.reduce(
          (acc: number, t: Transaction) => acc + t.amount,
          0
        );
        setBalance(total || 0);
      } catch (err: any) {
        console.error("Dashboard user fetch error:", err);
        if (err.message?.includes("401")) {
          clearToken();
          router.push("/login");
        } else {
          setError(err.message || "Failed to load dashboard data.");
        }
      }
    })();
  }, [router]);

  if (error)
    return (
      <div className="p-6 text-center text-red-500">
        <p>{error}</p>
        <Button onClick={() => router.push("/profile")} variant="outline">
          Back to Profile
        </Button>
      </div>
    );

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            Welcome back, {userName || "User"}!
          </h1>
        </div>

        {/* --- Account Summary Cards --- */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Balance
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{balance.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on your transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* --- Dashboard Tabs --- */}
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
              </TabsList>

              {/* --- Recent Transactions --- */}
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>
                      Here are the latest movements in your account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {transactions.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions
                            .slice()
                            .reverse()
                            .slice(0, 5)
                            .map((tx) => (
                              <TableRow key={tx.id}>
                                <TableCell className="font-medium">
                                  {tx.description}
                                  <div className="text-xs text-muted-foreground">
                                    {new Date(
                                      tx.transaction_date
                                    ).toLocaleDateString("en-IN")}
                                  </div>
                                </TableCell>
                                <TableCell>{tx.category}</TableCell>
                                <TableCell
                                  className={cn(
                                    "text-right font-medium",
                                    tx.amount > 0
                                      ? "text-green-500"
                                      : "text-red-500"
                                  )}
                                >
                                  {tx.amount > 0 ? "+" : "-"}₹
                                  {Math.abs(tx.amount).toLocaleString("en-IN")}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No transactions found.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* --- Spending Analysis (uses <DashboardSummary />) --- */}
              <TabsContent value="spending">
                <DashboardSummary /> {/* ✅ directly renders backend-connected summary */}
              </TabsContent>
            </Tabs>
          </div>

          {/* --- Sidebar: Alerts + Actions --- */}
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Scam Warning</AlertTitle>
              <AlertDescription>
                A new lottery scam is circulating on WhatsApp. Never click on
                suspicious links or share your OTP!
              </AlertDescription>
            </Alert>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Perform common tasks with a single click.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button>
                  <Send className="mr-2 h-4 w-4" /> Send Money
                </Button>
                <Button variant="outline">
                  <ScanLine className="mr-2 h-4 w-4" /> Pay a Bill
                </Button>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="w-full">
                  View All Actions <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
