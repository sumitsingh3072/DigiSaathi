"use client";

import { useEffect, useState } from "react";
import { apiFetch, authHeaders } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";

interface Document {
  filename: string;
  extracted_text: string;
  id: number;
  owner_id: number;
}

export default function Documents() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("You must be logged in to view documents.");
      setLoading(false);
      return;
    }

    apiFetch<Document[]>("/api/v1/documents/", { headers: authHeaders(token) })
      .then((res) => setDocs(res))
      .catch((err: unknown) => {
        if (err instanceof Error) setError(err.message);
        else setError("Failed to fetch documents");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl bg-white/10 dark:bg-black/20" />
        ))}
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-500 font-medium mt-4 backdrop-blur-md p-3 rounded-lg bg-red-500/10 border border-red-500/20">
        {error}
      </p>
    );

  if (docs.length === 0)
    return (
      <p className="text-center text-muted-foreground">
        No documents found. Upload or sync your documents to get started.
      </p>
    );

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {docs.map((doc) => (
        <Card
          key={doc.id}
          className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 hover:border-emerald-500/40 
          transition-all duration-300 shadow-lg hover:shadow-emerald-500/20 cursor-pointer"
        >
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-emerald-400 truncate">{doc.filename}</CardTitle>
            <FileText className="text-emerald-400 w-5 h-5" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {doc.extracted_text || "No extracted text available."}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
