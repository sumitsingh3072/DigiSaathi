"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LayoutGrid, MessageSquare, IndianRupee, UserCheck, GraduationCap, FileText, ShieldCheck, Upload } from "lucide-react";

const exploreItems = [
  { title: "Dashboard", icon: <LayoutGrid className="w-6 h-6" />, href: "/dashboard" },
  { title: "Chat Assistant", icon: <MessageSquare className="w-6 h-6" />, href: "/chat" },
  { title: "Payments", icon: <IndianRupee className="w-6 h-6" />, href: "/payments" },
  { title: "KYC Verification", icon: <UserCheck className="w-6 h-6" />, href: "/kyc" },
  { title: "Learn", icon: <GraduationCap className="w-6 h-6" />, href: "/education" },
  { title: "Documents", icon: <FileText className="w-6 h-6" />, href: "/documents" },
  { title: "Fraud Checker", icon: <ShieldCheck className="w-6 h-6" />, href: "/fraud-checker" },
  { title: "Document Analysis", icon: <FileText className="w-6 h-6" />, href: "/document-analysis" },
  { title: "Expense Upload", icon: <Upload className="w-6 h-6" />, href: "/expense-upload" },
];

export default function ExplorePage() {
  return (
    <div className="min-h-screen w-full px-6 py-16 flex flex-col items-center justify-start bg-gradient-to-b from-background to-emerald-950/10 dark:from-background dark:to-emerald-900/10">
      <h1 className="text-4xl font-bold mb-10 text-emerald-500">Explore Features</h1>

      <div className="grid gap-6 w-full max-w-5xl sm:grid-cols-2 lg:grid-cols-3">
        {exploreItems.map((item) => (
          <Link key={item.title} href={item.href}>
            <Card
              className="group cursor-pointer backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 hover:border-emerald-500/40 
              transition-all duration-300 shadow-lg hover:shadow-emerald-500/20"
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-emerald-400 group-hover:text-emerald-500 transition-colors">
                  {item.title}
                </CardTitle>
                <div className="text-emerald-400 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Explore more about {item.title} here.
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
