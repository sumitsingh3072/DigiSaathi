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

interface DocumentAnalysisResult {
  document_type: string;
  extracted_data: {
    vendor_name: string;
    total_amount: string;
    due_date: string | null;
  };
}

export default function DocumentAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<DocumentAnalysisResult | null>(null);
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

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("No file selected", {
        description: "Please choose a bill, receipt, or document to analyze.",
      });
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error("Not Logged In", {
        description: "Please log in before analyzing documents.",
      });
      router.push("/login");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Step 1: Analyze document
      const res = await fetch(`${BASE_URL}/api/v1/document-analysis/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          (data && data.detail) || "Unable to analyze the document."
        );
      }

      const analysis: DocumentAnalysisResult = await res.json();
      setResult(analysis);

      toast.success("Document Analyzed", {
        description: "Your document has been analyzed successfully.",
      });
    } catch (err: any) {
      toast.error("Error", {
        description: err.message || "An error occurred during analysis.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <Card className="max-w-xl mx-auto w-full bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle>Document Analyzer</CardTitle>
          <CardDescription>
            Upload an invoice, receipt, or bill to automatically extract key
            details and save it securely.
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
                accept="image/*,application/pdf"
                onChange={handleFileChange}
              />
            </label>
            <p className="text-xs text-gray-500">
              Accepted formats: JPG, PNG, or PDF (Max 10MB)
            </p>
            {file && (
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Selected: {file.name}
              </p>
            )}
          </div>

          {/* Result Section */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2 pt-4"
            >
              <h3 className="font-semibold flex items-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="mr-2 h-5 w-5" /> Extracted Document
                Details
              </h3>
              <p>
                <strong>Document Type:</strong> {result.document_type}
              </p>
              <p>
                <strong>Vendor Name:</strong>{" "}
                {result.extracted_data.vendor_name || "N/A"}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹
                {result.extracted_data.total_amount || "N/A"}
              </p>
              <p>
                <strong>Due Date:</strong>{" "}
                {result.extracted_data.due_date || "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">
                Verify the extracted details before proceeding.
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
              onClick={() => router.push("/documents")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Open in Documents
            </Button>
          ) : (
            <Button onClick={handleAnalyze} disabled={loading || !file}>
              {loading ? "Analyzing..." : "Analyze & Save"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
