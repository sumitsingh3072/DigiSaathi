/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { UploadCloud, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { BASE_URL } from '@/lib/api';
import { getToken } from '@/utils/auth';

export default function KycPage() {
  const [file, setFile] = useState<File | null>(null);
  const [kycData, setKycData] = useState<any>(null);
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setKycData(null);
      setKycStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("No file selected", {
        description: "Please upload your Aadhaar or PAN image.",
      });
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error("Not Logged In", {
        description: "Please log in to continue KYC verification.",
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BASE_URL}/api/v1/ocr/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.detail || "Failed to process document.");
      }

      const data = await res.json();
      setKycData(data);
      toast.success("Document Processed", {
        description: "Your identity details have been extracted successfully.",
      });
    } catch (err: any) {
      toast.error("Upload Failed", {
        description: err.message || "Error during document processing.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmKyc = async () => {
    if (!kycData) return;

    const token = getToken();
    if (!token) {
      toast.error("Not Logged In", {
        description: "Please log in to confirm your KYC.",
      });
      return;
    }

    setIsConfirming(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/kyc/confirm`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(kycData),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.detail || "Failed to confirm KYC.");
      }

      const data = await res.json();
      setKycStatus(data.status || "verified");
      toast.success("KYC Confirmed", {
        description: "Your KYC has been verified successfully!",
      });
    } catch (err: any) {
      toast.error("Confirmation Failed", {
        description: err.message || "Something went wrong.",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCheckStatus = async () => {
    const token = getToken();
    if (!token) {
      toast.error("Not Logged In", {
        description: "Please log in to check your KYC status.",
      });
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/v1/kyc/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch KYC status.");

      const data = await res.json();
      setKycStatus(data.status || "Unknown");
      toast.success("KYC Status Retrieved", {
        description: `Current status: ${data.status}`,
      });
    } catch (err: any) {
      toast.error("Failed to Check Status", {
        description: err.message,
      });
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="max-w-xl mx-auto w-full">
        <CardHeader>
          <CardTitle>KYC Verification</CardTitle>
          <CardDescription>
            Upload your Aadhaar or PAN card image to verify your identity.
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
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
            <p className="text-xs text-gray-500">Supported: PNG, JPG (max 10MB)</p>
            {file && <p className="mt-2 text-sm text-gray-700">Selected: {file.name}</p>}
          </div>

          {/* Extracted Data */}
          {kycData && (
            <div className="space-y-2 pt-4">
              <h3 className="font-semibold flex items-center text-green-700">
                <CheckCircle className="mr-2" /> Extracted Information
              </h3>
              <p><strong>Name:</strong> {kycData.name || "N/A"}</p>
              <p><strong>Date of Birth:</strong> {kycData.dob || "N/A"}</p>
              <p><strong>Address:</strong> {kycData.address || "N/A"}</p>
              <p><strong>ID Number:</strong> {kycData.id_number || "N/A"}</p>
              <p className="text-sm text-muted-foreground">
                Please review these details before confirming.
              </p>
            </div>
          )}

          {/* Status Display */}
          {kycStatus && (
            <div
              className={`rounded-lg p-3 border text-sm ${
                kycStatus === 'verified'
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'bg-yellow-50 border-yellow-300 text-yellow-700'
              }`}
            >
              <strong>KYC Status:</strong> {kycStatus.toUpperCase()}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-2 flex-wrap">
          <Button variant="outline" onClick={handleCheckStatus}>
            Check Status
          </Button>
          {kycData && !kycStatus && (
            <Button onClick={handleConfirmKyc} disabled={isConfirming}>
              {isConfirming ? "Confirming..." : "Confirm KYC"}
            </Button>
          )}
          <Button onClick={handleUpload} disabled={isLoading || !file}>
            {isLoading ? "Processing..." : "Upload & Verify"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
