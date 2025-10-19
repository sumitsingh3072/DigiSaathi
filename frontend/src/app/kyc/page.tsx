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
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setKycData(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("No file selected", {
        description: "Please upload your document image.",
      });
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error("Not Logged In", {
        description: "Please log in to continue document processing.",
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
        description: "Text has been extracted successfully from your document.",
      });
    } catch (err: any) {
      toast.error("Upload Failed", {
        description: err.message || "Error during document processing.",
      });
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="flex items-center justify-center py-12">
      <Card className="max-w-xl mx-auto w-full">
        <CardHeader>
          <CardTitle>Document Text Extraction</CardTitle>
          <CardDescription>
            Upload any document image to extract text using OCR technology.
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
                <CheckCircle className="mr-2" /> Extracted Text
              </h3>
              <p><strong>Filename:</strong> {kycData.filename || "N/A"}</p>
              <div className="mt-3">
                <p><strong>Extracted Text:</strong></p>
                <div className="bg-gray-50 p-3 rounded-md border mt-2">
                  <p className="text-sm whitespace-pre-wrap">{kycData.extracted_text || "No text found"}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                The document has been processed and saved to your documents.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-2 flex-wrap">
          <Button onClick={handleUpload} disabled={isLoading || !file}>
            {isLoading ? "Processing..." : "Extract Text"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
