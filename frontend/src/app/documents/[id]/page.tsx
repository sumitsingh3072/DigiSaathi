/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch, authHeaders } from "@/lib/api";
import { getToken, clearToken } from "@/utils/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Document {
  id: number;
  filename: string;
  extracted_text: string;
  uploaded_at?: string;
  owner_id: number;
}

export default function DocumentDetailPage() {
  const { id } = useParams();
  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
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
        const res = await apiFetch<Document>(`/api/v1/documents/${id}`, {
          headers: authHeaders(token),
        });
        setDoc(res);
      } catch (err: any) {
        if (err.message?.includes("401")) {
          clearToken();
          router.push("/login");
        } else {
          setError(err.message || "Failed to fetch document details.");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="max-w-lg w-full p-6 bg-white/10 dark:bg-black/20 backdrop-blur-lg border-white/20 shadow-lg">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </Card>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-10">
        <p>{error}</p>
        <Button onClick={() => router.push("/documents")} className="mt-4">
          Go Back
        </Button>
      </div>
    );

  if (!doc) return null;

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <Card className="max-w-2xl w-full bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 shadow-lg">
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle className="text-emerald-400">{doc.filename}</CardTitle>
            <CardDescription>
              Uploaded on{" "}
              {doc.uploaded_at
                ? new Date(doc.uploaded_at).toLocaleString("en-IN")
                : "Unknown"}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/documents")}
          >
            <ArrowLeft className="mr-1 w-4 h-4" /> Back
          </Button>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-white/20 dark:bg-black/20 rounded-md border border-white/20 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-300 max-h-[60vh] overflow-y-auto">
            {doc.extracted_text || "No extracted text found for this document."}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
