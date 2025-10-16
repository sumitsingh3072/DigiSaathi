'use client';

import { easeInOut, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield } from 'lucide-react';
import { Pacifico } from 'next/font/google';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-pacifico',
});

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = 'from-white/[0.08]',
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn('absolute', className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            'absolute inset-0 rounded-full',
            'bg-gradient-to-r to-transparent',
            gradient,
            'border-2 border-white/80 backdrop-blur-[2px] dark:border-white/80',
            'shadow-[0_8px_32px_0_rgba(255,255,255,0.4)] dark:shadow-[0_8px_32px_0_rgba(255,255,255,0.5)]',
            'after:absolute after:inset-0 after:rounded-full',
            'after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.6),transparent_70%)]',
            'dark:after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.7),transparent_70%)]',
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export default function HeroGeometric({
  badge = 'DigiSaathi',
  title1 = 'Your Financial Companion,',
  title2 = 'Simple & Safe',
}: {
  badge?: string;
  title1?: string;
  title2?: string;
}) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: easeInOut,
      },
    }),
  };

  return (
    <div className="bg-background relative flex min-h-screen w-full items-center justify-center overflow-hidden dark:bg-black">
      <div className="from-green-500/20 dark:from-green-500/30 absolute inset-0 bg-gradient-to-br via-transparent to-blue-500/20 blur-3xl dark:to-blue-500/30" />

      {/* Background shapes remain for aesthetic appeal */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-green-500/70"
          className="top-[15%] left-[-10%] md:top-[20%] md:left-[-5%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-blue-400"
          className="top-[70%] right-[-5%] md:top-[75%] md:right-[0%]"
        />
      </div>

      {/* Main Content Container: Increased z-index to ensure it's on top of the overlay */}
      <div className="relative z-20 container mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="border-primary/30 bg-card/50 mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 shadow-sm backdrop-blur-sm md:mb-12"
          >
            <Shield className="text-green-500" />
            <span className="text-foreground text-sm font-medium font-mono tracking-wide">
              {badge}
            </span>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="mx-4 mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:mb-8 md:text-8xl">
              <span className="from-foreground to-foreground/80 bg-gradient-to-b bg-clip-text text-transparent">
                {title1}
              </span>
              <br />
              <span
                className={cn(
                  'from-green-500 via-green-500/90 bg-gradient-to-r to-blue-500 bg-clip-text p-4 text-transparent',
                  pacifico.className,
                  'font-bold',
                )}
              >
                {title2}
              </span>
            </h1>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-muted-foreground mx-auto mb-10 max-w-xl px-4 text-base leading-relaxed sm:text-lg md:text-xl">
              Your friendly AI assistant for simple banking, payments, and savings in your own language. We make managing money easy and protect you from scams.
            </p>
          </motion.div>

          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="from-green-500 shadow-green-500/10 hover:from-green-500/90 rounded-full border-none bg-gradient-to-r to-blue-500 shadow-md hover:to-blue-500/90"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-primary/5 rounded-full shadow-sm"
              >
                Explore Services
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Gradient Overlay: Given a lower z-index to sit below the content */}
      <div className="from-background to-background/80 pointer-events-none absolute inset-0 z-10 bg-gradient-to-t via-transparent dark:from-black dark:to-black/80" />
    </div>
  );
}
