'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

function FAQItem({ question, answer, index }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.15,
        ease: 'easeOut',
      }}
      className={cn(
        'group border-border/60 rounded-lg border',
        'transition-all duration-200 ease-in-out',
        isOpen ? 'bg-card/30 shadow-sm' : 'hover:bg-card/50',
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 px-6 py-4"
      >
        <h3
          className={cn(
            'text-left text-base font-medium transition-colors duration-200',
            'text-foreground/80',
            isOpen && 'text-foreground',
          )}
        >
          {question}
        </h3>
        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
            scale: isOpen ? 1.1 : 1,
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
          className={cn(
            'shrink-0 rounded-full p-0.5',
            'transition-colors duration-200',
            isOpen ? 'text-green-500' : 'text-muted-foreground',
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: {
                height: {
                  duration: 0.4,
                  ease: [0.04, 0.62, 0.23, 0.98],
                },
                opacity: {
                  duration: 0.25,
                  delay: 0.1,
                },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: {
                  duration: 0.3,
                  ease: 'easeInOut',
                },
                opacity: {
                  duration: 0.25,
                },
              },
            }}
          >
            <div className="border-border/40 border-t px-6 pt-2 pb-4">
              <motion.p
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: 'easeOut',
                }}
                className="text-muted-foreground text-sm leading-relaxed"
              >
                {answer}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Faq() {
  const faqs: Omit<FAQItemProps, 'index'>[] = [
    {
      question: 'What is DigiSaathi?',
      answer:
        "DigiSaathi is your personal AI financial assistant, designed to make digital banking, payments, and savings simple and safe. You can chat with it in your own language to get help with your financial tasks.",
    },
    {
      question: 'Is DigiSaathi free to use?',
      answer:
        'Yes, the core features of DigiSaathi, including the AI assistant, fraud alerts, and financial education, are completely free to use. Standard bank or transaction charges may still apply depending on the service.',
    },
    {
      question: 'Is my bank and personal information safe?',
      answer:
        "Absolutely. We use bank-grade encryption and security standards to protect all your data. Your personal information is never shared without your permission. Your trust is our top priority.",
    },
    {
      question: 'What languages does the app support?',
      answer:
        'DigiSaathi is designed for India. It supports English, Hindi, and we are continuously adding more regional languages to make it accessible to everyone.',
    },
    {
      question: 'Do I need to be a technology expert to use this app?',
      answer:
        'Not at all! DigiSaathi is built for everyone, especially those who are new to digital finance. The conversational interface is as easy as talking to a person. If you can chat, you can use DigiSaathi.',
    },
  ];

  return (
    <section className="bg-background relative w-full overflow-hidden py-16">
      {/* Decorative elements with updated theme */}
      <div className="bg-green-500/10 absolute top-20 -left-20 h-64 w-64 rounded-full blur-3xl" />
      <div className="bg-blue-500/10 absolute -right-20 bottom-20 h-64 w-64 rounded-full blur-3xl" />

      <div className="relative container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <Badge
            variant="outline"
            className="border-green-500/50 mb-4 px-3 py-1 text-xs font-medium tracking-wider uppercase"
          >
            FAQs
          </Badge>

          <h2 className="from-green-500 mb-3 bg-gradient-to-r to-blue-500 bg-clip-text text-3xl font-bold text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-sm">
            Get answers to your questions about DigiSaathi.
          </p>
        </motion.div>

        <div className="mx-auto max-w-2xl space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={cn('mx-auto mt-12 max-w-md rounded-lg p-6 text-center')}
        >
          <div className="bg-green-500/10 text-green-500 mb-4 inline-flex items-center justify-center rounded-full p-2">
            <Mail className="h-4 w-4" />
          </div>
          <p className="text-foreground mb-1 text-sm font-medium">
            Still have questions?
          </p>
          <p className="text-muted-foreground mb-4 text-xs">
            We&apos;re here to help you
          </p>
          <button
            type="button"
            className={cn(
              'rounded-md px-4 py-2 text-sm',
              'bg-green-500 text-white',
              'hover:bg-green-500/90',
              'transition-colors duration-200',
              'font-medium',
            )}
          >
            Contact Support
          </button>
        </motion.div>
      </div>
    </section>
  );
}
