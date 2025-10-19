/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/lib/api";
import { getToken } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UploadCloud, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ExpenseResult {
  description: string;
  amount: number;
  category: string;
  vendor_name: string;
  id: number;
  owner_id: number;
  transaction_date: string;
}

export default function ExpenseUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ExpenseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setResult(null);
      setSaved(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("No file selected", {
        description: "Please upload a valid bill or invoice image.",
      });
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error("Not Logged In", {
        description: "Please log in to process your bill.",
      });
      router.push("/login");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // --- Send request to backend ---
      const res = await fetch(`${BASE_URL}/api/v1/expense/process-bill`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          (data && data.detail) || "Unable to extract details from the bill."
        );
      }

      const data: ExpenseResult = await res.json();
      setResult(data);
      setSaved(true);

      toast.success("Bill Processed!", {
        description: "Expense details extracted and saved successfully.",
      });
    } catch (err: any) {
      toast.error("Error Processing Bill", {
        description: err.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <Card className="max-w-xl mx-auto w-full bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle>Expense Bill Processor</CardTitle>
          <CardDescription>
            Upload a bill or invoice image to automatically extract expense
            details and record it in your dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center transition hover:border-emerald-400">
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-medium text-emerald-600 hover:text-emerald-500"
            >
              <span>Upload a file</span>
              <Input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept="image/*,application/pdf"
              />
            </label>
            <p className="text-xs text-gray-500">
              Supported formats: PNG, JPG, or PDF (Max 10MB)
            </p>
            {file && (
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Selected: {file.name}
              </p>
            )}
          </div>

          {/* Extracted Data Section */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2 pt-4"
            >
              <h3 className="font-semibold flex items-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="mr-2 h-5 w-5" /> Extracted Expense Details
              </h3>
              <p>
                <strong>Description:</strong> {result.description}
              </p>
              <p>
                <strong>Amount:</strong> ₹{result.amount.toFixed(2)}
              </p>
              <p>
                <strong>Category:</strong> {result.category || "N/A"}
              </p>
              <p>
                <strong>Vendor:</strong> {result.vendor_name || "Unknown"}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(result.transaction_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Please verify the extracted details before proceeding.
              </p>
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setFile(null);
              setResult(null);
              setSaved(false);
            }}
          >
            Reset
          </Button>

          {saved ? (
            <Button
              variant="default"
              onClick={() => router.push("/dashboard")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Open Dashboard
            </Button>
          ) : (
            <Button onClick={handleUpload} disabled={loading || !file}>
              {loading ? "Processing..." : "Upload & Extract"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
