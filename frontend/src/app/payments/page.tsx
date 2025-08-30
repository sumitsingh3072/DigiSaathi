'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Send,
  QrCode,
  ReceiptText,
  Search,
  Users,
  ArrowRight,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

// --- Data Types and Mock Data ---
type Payee = {
  name: string;
  upiId: string;
  avatarUrl?: string;
};

const recentPayees: Payee[] = [
  { name: 'Sanjay\'s Shop', upiId: 'sanjaykirana@upi', avatarUrl: 'https://placehold.co/40x40/22c55e/ffffff?text=S' },
  { name: 'Sunita Devi', upiId: 'sunita.devi@upi', avatarUrl: 'https://placehold.co/40x40/3b82f6/ffffff?text=S' },
  { name: 'Electricity Board', upiId: 'biharbill@upi', avatarUrl: 'https://placehold.co/40x40/f97316/ffffff?text=E' },
  { name: 'Ravi Kumar', upiId: 'ravikumar88@upi', avatarUrl: 'https://placehold.co/40x40/8b5cf6/ffffff?text=R' },
];


// --- Main Payments Page Component ---
export default function PaymentsPage() {
  const handleActionClick = (action: string) => {
    toast.info(`'${action}' feature coming soon!`, {
      description: 'This is a demonstration and this feature is not yet implemented.',
    });
  };
  
  return (
    <div className="flex w-full flex-col">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="mb-2 inline-flex items-center justify-center rounded-full bg-primary/10 p-3 text-primary">
            <Send className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Send & Receive Money</h1>
          <p className="text-muted-foreground max-w-lg">
            Easily pay friends, family, and businesses using UPI.
          </p>
        </div>

        {/* Action Cards Section */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => handleActionClick('Send Money')}>
            <CardHeader className="items-center text-center">
              <QrCode className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Scan & Pay</CardTitle>
              <CardDescription>Pay anyone using a QR code.</CardDescription>
            </CardHeader>
          </Card>
           <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => handleActionClick('Send Money to UPI ID')}>
            <CardHeader className="items-center text-center">
              <Send className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Send to UPI ID</CardTitle>
              <CardDescription>Enter a UPI ID to send money.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => handleActionClick('Pay Bills')}>
            <CardHeader className="items-center text-center">
              <ReceiptText className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Pay Bills</CardTitle>
              <CardDescription>Pay for electricity, water, and more.</CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        {/* Recent Payees Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Recent Payees
            </CardTitle>
            <CardDescription>
              Select someone you have paid recently or search for a new contact.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or UPI ID..." className="pl-8" />
            </div>
            <div className="space-y-4">
              {recentPayees.map((payee) => (
                <div key={payee.upiId} className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={payee.avatarUrl} alt={payee.name} />
                      <AvatarFallback>{payee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{payee.name}</p>
                      <p className="text-sm text-muted-foreground">{payee.upiId}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleActionClick(`Pay ${payee.name}`)}>
                    Pay <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
