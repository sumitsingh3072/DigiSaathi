"use client";

import { useState } from "react";
import { apiFetch, authHeaders } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { AlertCircle, ShieldCheck, ShieldOff } from "lucide-react";

interface FraudResult {
  is_scam: boolean;
  reason: string;
}

export default function FraudChecker() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<FraudResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("You must be logged in to analyze messages.");
      setLoading(false);
      return;
    }

    try {
      const data = await apiFetch<FraudResult>("/api/v1/fraud/analyze", {
        method: "POST",
        headers: authHeaders(token, "application/json"),
        body: JSON.stringify({ text }),
      });
      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 shadow-lg hover:shadow-emerald-500/20 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-emerald-400">Enter Message to Analyze</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste suspicious message or email here..."
            required
            className="min-h-[120px] resize-none text-sm border border-emerald-500/30 focus:border-emerald-500 focus:ring-emerald-500 bg-white/5 dark:bg-black/30 backdrop-blur-sm"
          />
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-2 text-red-500 font-medium bg-red-500/10 border border-red-500/30 p-3 rounded-lg backdrop-blur-md">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {result && (
        <Card
          className={`mt-4 backdrop-blur-md border ${
            result.is_scam
              ? "bg-red-500/10 border-red-500/30 hover:shadow-red-500/20"
              : "bg-emerald-500/10 border-emerald-500/30 hover:shadow-emerald-500/20"
          } shadow-md transition-all duration-300`}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle
              className={`text-lg font-semibold ${
                result.is_scam ? "text-red-400" : "text-emerald-400"
              }`}
            >
              {result.is_scam ? "Potential Scam Detected" : "Safe Message"}
            </CardTitle>
            {result.is_scam ? (
              <ShieldOff className="w-6 h-6 text-red-400" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            )}
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{result.reason}</p>
          </CardContent>
        </Card>
      )}
    </form>
  );
}
