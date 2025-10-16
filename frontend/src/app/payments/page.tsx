/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
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
import { BASE_URL, apiFetch, authHeaders } from '@/lib/api';
import { getToken } from '@/utils/auth';

// --- Data Types ---
interface Payee {
  id: number;
  name: string;
  upi_id: string;
  avatar_url?: string;
}

export default function PaymentsPage() {
  const [recentPayees, setRecentPayees] = useState<Payee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Payee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sendingTo, setSendingTo] = useState<Payee | null>(null);
  const [amount, setAmount] = useState('');

  // Fetch recent payees
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    apiFetch<Payee[]>(`/api/v1/payments/recent`, { headers: authHeaders(token) })
      .then(setRecentPayees)
      .catch(() => toast.error('Failed to load recent payees.'));
  }, []);

  // Search payee
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    const token = getToken();
    if (!token) return toast.error('Please log in first.');

    setIsLoading(true);
    try {
      const res = await apiFetch<Payee[]>(`/api/v1/payments/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: authHeaders(token),
      });
      setSearchResults(res);
      if (res.length === 0) toast.info('No results found.');
    } catch (err) {
      toast.error('Search failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Send money to payee
  const handleSendMoney = async (payee: Payee) => {
    if (!amount) {
      toast.error('Enter an amount before sending.');
      return;
    }

    const token = getToken();
    if (!token) return toast.error('Please log in to make payments.');

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/payments/send`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient_upi: payee.upi_id,
          amount: parseFloat(amount),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success('Payment Successful!', {
          description: `₹${amount} sent to ${payee.name}. Ref: ${data.reference_id}`,
        });
        setAmount('');
        setSendingTo(null);
      } else {
        const errData = await res.json();
        toast.error('Payment Failed', {
          description: errData.detail || 'Transaction could not be processed.',
        });
      }
    } catch (err: any) {
      toast.error('Network Error', { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Pay generic bill (e.g. electricity)
  const handlePayBill = async () => {
    const token = getToken();
    if (!token) return toast.error('Please log in.');

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/payments/bill`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: 'electricity', amount: 500 }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success('Bill Paid Successfully!', {
          description: `Payment ID: ${data.payment_id}`,
        });
      } else {
        const errData = await res.json();
        toast.error('Bill Payment Failed', { description: errData.detail });
      }
    } catch (err: any) {
      toast.error('Network Error', { description: err.message });
    } finally {
      setIsLoading(false);
    }
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
            Instantly pay friends, family, or businesses via UPI.
          </p>
        </div>

        {/* Action Cards Section */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="items-center text-center">
              <QrCode className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Scan & Pay</CardTitle>
              <CardDescription>Coming soon!</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="items-center text-center">
              <Send className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Send to UPI ID</CardTitle>
              <CardDescription>Enter a UPI ID to send money.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Enter UPI ID or Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="mb-3"
              />
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
              {searchResults.length > 0 && (
                <div className="mt-4 space-y-2">
                  {searchResults.map((res) => (
                    <div
                      key={res.upi_id}
                      className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={res.avatar_url} />
                          <AvatarFallback>{res.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{res.name}</p>
                          <p className="text-sm text-muted-foreground">{res.upi_id}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSendingTo(res)}
                      >
                        Pay
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card
            className="hover:border-primary/50 transition-colors cursor-pointer"
            onClick={handlePayBill}
          >
            <CardHeader className="items-center text-center">
              <ReceiptText className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Pay Bills</CardTitle>
              <CardDescription>Pay electricity, water & gas bills.</CardDescription>
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
              Tap a contact to send money instantly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentPayees.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No recent payments found.
              </p>
            ) : (
              <div className="space-y-4">
                {recentPayees.map((payee) => (
                  <div
                    key={payee.id}
                    className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={payee.avatar_url} alt={payee.name} />
                        <AvatarFallback>{payee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{payee.name}</p>
                        <p className="text-sm text-muted-foreground">{payee.upi_id}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSendingTo(payee)}>
                      Pay <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Modal Inline */}
        {sendingTo && (
          <Card className="mt-6 border-primary/50">
            <CardHeader>
              <CardTitle>Send Money to {sendingTo.name}</CardTitle>
              <CardDescription>{sendingTo.upi_id}</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                placeholder="Enter amount (₹)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </CardContent>
            <div className="flex justify-end gap-2 p-4">
              <Button variant="outline" onClick={() => setSendingTo(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleSendMoney(sendingTo)} disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Send'}
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
