/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, authHeaders } from "@/lib/api";
import { getToken, clearToken } from "@/utils/auth";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, UploadCloud, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Document {
  id: number;
  filename: string;
  extracted_text: string;
  uploaded_at?: string;
  owner_id: number;
}

export default function Documents() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const fetchDocuments = async () => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const res = await apiFetch<Document[]>("/api/v1/documents/", {
        headers: authHeaders(token),
      });
      setDocs(res);
    } catch (err: any) {
      if (err.message?.includes("401")) {
        clearToken();
        router.push("/login");
      } else {
        setError(err.message || "Failed to fetch documents.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Upload Document Handler ---
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      await apiFetch("/api/v1/documents/upload/", {
        method: "POST",
        headers: authHeaders(token), // Don't set content-type manually when sending FormData
        body: formData,
      });

      toast.success("File uploaded successfully!");
      setFile(null);
      await fetchDocuments();
    } catch (err: any) {
      toast.error(err.message || "Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // --- Loading UI ---
  if (loading)
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton
            key={i}
            className="h-40 w-full rounded-xl bg-white/10 dark:bg-black/20"
          />
        ))}
      </div>
    );

  // --- Error UI ---
  if (error)
    return (
      <p className="text-center text-red-500 font-medium mt-4 backdrop-blur-md p-3 rounded-lg bg-red-500/10 border border-red-500/20">
        {error}
      </p>
    );

  return (
    <div className="min-h-screen px-6 py-10">
      {/* --- Upload Section --- */}
      <Card className="mb-8 bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20">
        <CardHeader>
          <CardTitle className="text-emerald-400 flex items-center gap-2">
            <UploadCloud className="w-5 h-5" /> Upload New Document
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="flex-1"
          />
          <Button
            disabled={!file || uploading}
            onClick={handleUpload}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </CardContent>
      </Card>

      {/* --- Document List --- */}
      {docs.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No documents found. Upload or sync your documents to get started.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => (
            <Card
              key={doc.id}
              className="group backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 hover:border-emerald-500/40 
              transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 cursor-pointer"
            >
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-emerald-400 truncate flex items-center gap-2">
                  <FileText className="w-5 h-5" /> {doc.filename}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {doc.extracted_text || "No extracted text available."}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                <span>
                  {doc.uploaded_at
                    ? new Date(doc.uploaded_at).toLocaleDateString("en-IN")
                    : ""}
                </span>
                <Button
                  variant="link"
                  size="sm"
                  className="text-emerald-400 hover:text-emerald-500"
                  onClick={() => router.push(`/documents/${doc.id}`)}
                >
                  <Eye className="w-4 h-4 mr-1" /> View
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
