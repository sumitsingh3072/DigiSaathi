'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  ShieldCheck,
  MessageCircleQuestion,
  Smartphone,
  Banknote,
  GraduationCap,
  Lightbulb,
  AlertTriangle,
} from 'lucide-react';

// Define the type for our educational content
type EducationalTopic = {
  id: string;
  title: string;
  icon: React.ElementType;
  content: {
    heading: string;
    points: string[];
  };
};

// Educational content data
const topics: EducationalTopic[] = [
  {
    id: 'upi-basics',
    title: 'Understanding UPI',
    icon: Smartphone,
    content: {
      heading: 'Unified Payments Interface (UPI) is a simple and instant way to send and receive money.',
      points: [
        'You only need a virtual payment address (VPA), like yourname@bank.',
        'No need to share your bank account number or IFSC code for receiving money.',
        'You can pay directly from your bank account to another, 24/7.',
        'Always set a strong UPI PIN and never share it with anyone.',
      ],
    },
  },
  {
    id: 'scam-awareness',
    title: 'How to Recognize Scams',
    icon: ShieldCheck,
    content: {
      heading: 'Scammers try to trick you into sending them money or personal information. Here’s what to look out for:',
      points: [
        '**Urgent Messages:** Scammers create a false sense of urgency, like "Your account will be blocked!"',
        '**Winning Lotteries:** Messages claiming you have won a prize for a contest you never entered.',
        '**Requesting OTP/PIN:** Banks or any genuine company will NEVER ask for your OTP or PIN.',
        '**Fake Links:** Be careful of links in SMS or WhatsApp that look like official websites but have small spelling mistakes.',
      ],
    },
  },
  {
    id: 'budgeting-tips',
    title: 'Simple Budgeting Tips',
    icon: Banknote,
    content: {
      heading: 'Managing your money helps you save for your goals. Here are some easy tips:',
      points: [
        'Track your spending for a month to see where your money goes.',
        'Separate your needs (like rent, food) from your wants (like eating out).',
        'Set a small savings goal every month, even if it\'s just ₹100.',
        'Review your budget regularly and adjust it as your income or expenses change.',
      ],
    },
  },
];

export default function EducationPage() {
  return (
    <div className="flex w-full flex-col">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-2">
           <div className="mb-2 inline-flex items-center justify-center rounded-full bg-primary/10 p-3 text-primary">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Education Hub</h1>
          <p className="text-muted-foreground max-w-lg">
            Knowledge is power. Learn how to manage your money safely and confidently with our simple guides.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Main Educational Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircleQuestion className="h-6 w-6" />
                  Frequently Asked Topics
                </CardTitle>
                <CardDescription>
                  Click on a topic to learn more about it.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {topics.map((topic) => (
                    <AccordionItem key={topic.id} value={topic.id}>
                      <AccordionTrigger className="text-base font-semibold">
                        <div className="flex items-center gap-3">
                          <topic.icon className="h-5 w-5 text-primary" />
                          {topic.title}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 text-base">
                        <p className="font-semibold text-foreground mb-3">{topic.content.heading}</p>
                        <ul className="space-y-2 pl-4 list-disc text-muted-foreground">
                          {topic.content.points.map((point, index) => (
                            <li key={index} dangerouslySetInnerHTML={{ __html: point }} />
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with Key Tips */}
          <div className="space-y-6">
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Lightbulb className="h-6 w-6" />
                  Top Safety Tip
                </CardTitle>
              </CardHeader>
              <CardContent className="text-green-800 dark:text-green-300">
                <p className="font-semibold">
                  Never share your UPI PIN, OTP, or password with anyone.
                </p>
                <p className="text-sm mt-1">
                  Your bank will never call you to ask for these details. If someone does, it&apos;s a scam.
                </p>
              </CardContent>
            </Card>
             <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Beware of QR Code Scams!</AlertTitle>
              <AlertDescription>
                You do NOT need to scan a QR code to receive money. Only scan codes when you are paying someone you trust.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </main>
    </div>
  );
}
