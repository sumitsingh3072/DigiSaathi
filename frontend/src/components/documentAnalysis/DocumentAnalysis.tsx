/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("No file selected", {
        description: "Please choose a bill, receipt, or document to analyze.",
      });
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Not Logged In", {
        description: "Please log in before analyzing documents.",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BASE_URL}/api/v1/document-analysis/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
        toast.success("Analysis Complete", {
          description: "Your document has been analyzed successfully.",
        });
      } else {
        const data = await res.json().catch(() => null);
        toast.error("Analysis Failed", {
          description: (data && data.detail) || "Unable to process the document.",
        });
      }
    } catch (err: any) {
      toast.error("Network Error", {
        description: err.message || "Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="max-w-xl mx-auto w-full">
        <CardHeader>
          <CardTitle>Document Analyzer</CardTitle>
          <CardDescription>
            Upload an invoice, receipt, or bill to automatically extract key details.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500"
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
            <p className="text-xs text-gray-500">Accepted formats: JPG, PNG, or PDF (Max 10MB)</p>
            {file && (
              <p className="mt-2 text-sm text-gray-700">Selected: {file.name}</p>
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
              <h3 className="font-semibold flex items-center text-green-700">
                <CheckCircle className="mr-2 h-5 w-5" /> Extracted Document Details
              </h3>
              <p><strong>Document Type:</strong> {result.document_type}</p>
              <p><strong>Vendor Name:</strong> {result.extracted_data.vendor_name || "N/A"}</p>
              <p><strong>Total Amount:</strong> ₹{result.extracted_data.total_amount || "N/A"}</p>
              <p><strong>Due Date:</strong> {result.extracted_data.due_date || "N/A"}</p>
              <p className="text-sm text-muted-foreground">
                Verify the extracted details before proceeding.
              </p>
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => { setFile(null); setResult(null); }}>
            Reset
          </Button>
          <Button onClick={handleAnalyze} disabled={loading || !file}>
            {loading ? "Analyzing..." : "Upload & Analyze"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
