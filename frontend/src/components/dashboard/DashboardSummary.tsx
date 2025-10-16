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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface DashboardSummaryData {
  total_spending: number;
  spending_by_category: Record<string, number>;
}

export default function DashboardSummary() {
  const [summary, setSummary] = useState<DashboardSummaryData | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    (async () => {
      try {
        const data = await apiFetch<DashboardSummaryData>(
          "/api/v1/dashboard/summary",
          {
            headers: authHeaders(token),
          }
        );
        setSummary(data);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        if (err.message?.includes("401")) {
          clearToken();
          router.push("/login");
        } else {
          setError(err.message || "Failed to fetch dashboard summary.");
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [router]);

  if (isLoading) return <DashboardSkeleton />;
  if (error)
    return (
      <Card className="max-w-md mx-auto mt-10 bg-red-100/30 dark:bg-red-900/30 border border-red-400/30 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-end">
          <Button onClick={() => router.push("/profile")} variant="outline">
            Back to Profile
          </Button>
        </CardContent>
      </Card>
    );

  if (!summary)
    return (
      <p className="text-center text-gray-500 mt-6">No data available yet.</p>
    );

  const chartData = Object.entries(summary.spending_by_category).map(
    ([name, value]) => ({ name, value })
  );

  const COLORS = ["#34d399", "#10b981", "#6ee7b7", "#059669", "#064e3b"];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gradient-to-b from-background to-emerald-900/10">
      <Card className="w-full max-w-2xl bg-white/30 dark:bg-black/30 backdrop-blur-lg border-white/20 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-emerald-500">
            Dashboard Summary
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Overview of your monthly spending
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-6">
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Total Spending:{" "}
            <span className="text-emerald-500">
              ₹{typeof summary.total_spending === 'number'
                ? summary.total_spending.toFixed(2)
                : Number(summary.total_spending).toFixed(2)}
            </span>
          </div>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name }) => name}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm">No category data available</p>
          )}

          <Button
            variant="outline"
            onClick={() => router.push("/profile")}
            className="mt-4"
          >
            View Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Skeleton Loading UI ---
const DashboardSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Card className="w-full max-w-2xl bg-white/30 dark:bg-black/30 backdrop-blur-lg border-white/20 shadow-xl p-6">
      <CardHeader>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-6 w-32 mx-auto" />
        <Skeleton className="h-64 w-full rounded-full" />
      </CardContent>
    </Card>
  </div>
);
