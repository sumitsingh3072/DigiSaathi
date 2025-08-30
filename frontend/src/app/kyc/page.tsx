/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { UploadCloud, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function KycPage() {
    const [file, setFile] = useState<File | null>(null);
    const [extractedData, setExtractedData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
            setExtractedData(null);
        }
    };

    const handleUpload = () => {
        if (!file) {
            // Corrected toast call for 'sonner'
            toast.error("No file selected", {
                description: "Please choose an Aadhaar or PAN card image to upload.",
            });
            return;
        }

        setIsLoading(true);
        // Simulate API call to OCR service
        setTimeout(() => {
            setExtractedData({
                name: "Ramesh Kumar",
                dob: "15-08-1985",
                address: "Village Rampur, Patna, Bihar",
                aadhaar: "**** **** 1234"
            });
            setIsLoading(false);
            // Corrected toast call for 'sonner'
            toast.success("Success!", {
                description: "Your document details have been extracted.",
            });
        }, 2000);
    };

    return (
        <div className="flex items-center justify-center py-12">
            <Card className="max-w-xl mx-auto w-full">
                <CardHeader>
                    <CardTitle>KYC Verification</CardTitle>
                    <CardDescription>Upload a clear photo of your Aadhaar or PAN card to get started.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500">
                            <span>Upload a file</span>
                            <Input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*"/>
                        </label>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        {file && <p className="mt-2 text-sm text-gray-700">Selected: {file.name}</p>}
                    </div>

                    {extractedData && (
                        <div className="space-y-2 pt-4">
                            <h3 className="font-semibold flex items-center text-green-700"><CheckCircle className="mr-2"/> Extracted Information</h3>
                            <p><strong>Name:</strong> {extractedData.name}</p>
                            <p><strong>Date of Birth:</strong> {extractedData.dob}</p>
                            <p><strong>Address:</strong> {extractedData.address}</p>
                            <p><strong>Aadhaar No:</strong> {extractedData.aadhaar}</p>
                            <p className="text-sm text-muted-foreground">Please confirm if these details are correct.</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleUpload} disabled={isLoading || !file}>
                        {isLoading ? "Reading..." : "Upload & Read"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
