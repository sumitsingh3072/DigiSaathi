'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
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
  ScanLine
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- Spending Chart Component (using Recharts for better integration with shadcn) ---
function SpendingChart() {
  const data = [
    { name: "Groceries", total: 2500 },
    { name: "Utilities", total: 1200 },
    { name: "Transport", total: 800 },
    { name: "Health", total: 450 },
    { name: "Other", total: 600 },
  ];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}


// --- Main Dashboard Page Component ---
export default function DashboardPage() {
  const user = {
    name: "Ramesh Kumar",
    balance: 3500.50,
    transactions: [
      { id: 1, type: "Govt. Subsidy", amount: 1500, date: "2025-08-22" },
      { id: 2, type: "Electricity Bill", amount: -550, date: "2025-08-25" },
      { id: 3, type: "Groceries", amount: -720, date: "2025-08-20" },
      { id: 4, type: "Mobile Recharge", amount: -199, date: "2025-08-18" },
    ],
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Welcome back, {user.name}!</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {/* Account Balance Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Account Balance
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{user.balance.toLocaleString('en-IN')}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          {/* You can add more summary cards here */}
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {/* Main Content: Transactions and Spending */}
          <div className="xl:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>
                      Here are the latest movements in your account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {user.transactions.map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell>
                              <div className="font-medium">{tx.type}</div>
                              <div className="text-sm text-muted-foreground">
                                {tx.date}
                              </div>
                            </TableCell>
                            <TableCell className={cn(
                              "text-right font-medium",
                              tx.amount > 0 ? "text-green-500" : "text-red-500"
                            )}>
                              {tx.amount > 0 ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="spending">
                <Card>
                  <CardHeader>
                    <CardTitle>This Month&apos;s Spending</CardTitle>
                    <CardDescription>A breakdown of your expenses by category.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SpendingChart />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar: Alerts and Quick Actions */}
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Scam Warning</AlertTitle>
              <AlertDescription>
                A new lottery scam is going around on WhatsApp. Remember: never click unknown links or share your OTP!
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
                <Button><Send className="mr-2 h-4 w-4" /> Send Money</Button>
                <Button variant="outline"><ScanLine className="mr-2 h-4 w-4" /> Pay a Bill</Button>
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
