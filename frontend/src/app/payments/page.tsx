'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Send,
  Construction,
} from 'lucide-react';

export default function PaymentsPage() {
  return (
    <div className="flex w-full flex-col">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="mb-2 inline-flex items-center justify-center rounded-full bg-primary/10 p-3 text-primary">
            <Send className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground max-w-lg">
            Payment functionality is currently under development.
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="flex justify-center">
          <Card className="max-w-md w-full">
            <CardHeader className="items-center text-center">
              <Construction className="h-16 w-16 text-muted-foreground mb-4" />
              <CardTitle className="text-xl">Coming Soon</CardTitle>
              <CardDescription className="text-center">
                We&apos;re working hard to bring you secure and fast payment features. 
                Stay tuned for updates!
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}
