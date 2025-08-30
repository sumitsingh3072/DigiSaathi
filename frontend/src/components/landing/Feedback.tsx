/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Angry, Check, Frown, Laugh, Loader2, Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";

// Feedback options with corresponding icons and colors
const feedback = [
  { happiness: 4, emoji: Laugh, color: "text-green-500" },
  { happiness: 3, emoji: Smile, color: "text-green-400" },
  { happiness: 2, emoji: Frown, color: "text-yellow-400" },
  { happiness: 1, emoji: Angry, color: "text-red-500" },
];

// Main Feedback component
export const Feedback = () => {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [happiness, setHappiness] = useState<null | number>(null);
  const [isSubmitted, setSubmissionState] = useState(false);
  const { submitFeedback, isLoading, isSent } = useSubmitFeedback();

  // Reset textarea when happiness level is cleared
  useEffect(() => {
    if (!happiness && textRef.current) {
      textRef.current.value = "";
    }
  }, [happiness]);

  // Handle the post-submission state
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    let submissionStateTimeout: NodeJS.Timeout | null = null;

    if (isSent) {
      setSubmissionState(true);

      // Reset form after 2 seconds
      timeout = setTimeout(() => {
        setHappiness(null);
        if (textRef.current) textRef.current.value = "";
      }, 2000);

      // Hide success message after 2.2 seconds
      submissionStateTimeout = setTimeout(() => {
        setSubmissionState(false);
      }, 2200);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
      if (submissionStateTimeout) clearTimeout(submissionStateTimeout);
    };
  }, [isSent]);

  return (
    // Wrapper to center the component on the page
    <div className="flex pb-32 w-full items-center justify-center bg-background">
      <motion.div
        layout
        initial={{ borderRadius: "2rem" }}
        animate={
          happiness ? { borderRadius: "0.75rem" } : { borderRadius: "2rem" }
        }
        className={twMerge(
          "w-fit overflow-hidden border p-2 shadow-lg",
          "border-white/20 bg-slate-800/40 backdrop-blur-lg", // Glassmorphism theme
        )}
      >
        <span className="flex items-center justify-center gap-3 pl-4 pr-2">
          <div className="text-sm text-neutral-200">
            Was this helpful?
          </div>
          <div className="flex items-center text-neutral-400">
            {feedback.map((e) => {
              const EmojiIcon = e.emoji;
              return (
                <button
                  onClick={() =>
                    setHappiness((prev) =>
                      e.happiness === prev ? null : e.happiness,
                    )
                  }
                  className={twMerge(
                    "flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-white/10",
                    happiness === e.happiness
                      ? `${e.color} bg-white/20`
                      : "text-neutral-400",
                  )}
                  key={e.happiness}
                >
                  <EmojiIcon size={18} />
                </button>
              );
            })}
          </div>
        </span>
        <motion.div
          aria-hidden={!happiness}
          initial={{ height: 0, y: 15 }}
          className="px-2"
          transition={{ ease: "easeInOut", duration: 0.3 }}
          animate={happiness ? { height: "195px", width: "330px" } : {}}
        >
          <AnimatePresence>
            {!isSubmitted ? (
              <motion.span exit={{ opacity: 0 }} initial={{ opacity: 1 }}>
                <textarea
                  ref={textRef}
                  placeholder="Your feedback helps us improve..."
                  className="min-h-32 w-full resize-none rounded-md border-white/20 bg-transparent p-2 text-sm text-white placeholder-neutral-400 focus:border-green-500 focus:outline-none"
                />
                <div className="flex h-fit w-full justify-end">
                  <button
                    onClick={() =>
                      submitFeedback(happiness!, textRef.current!.value || "")
                    }
                    className={cn(
                      "mt-1 flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-white transition-colors",
                      "bg-green-500 hover:bg-green-600", // Themed button
                      {
                        "cursor-not-allowed bg-neutral-500": isLoading,
                      },
                    )}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </motion.span>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="flex h-full w-full flex-col items-center justify-start gap-2 pt-9 text-sm font-normal text-neutral-200"
              >
                <motion.div
                  variants={item}
                  className="flex h-8 min-h-8 w-8 min-w-8 items-center justify-center rounded-full bg-green-500"
                >
                  <Check strokeWidth={2.5} size={16} className="stroke-white" />
                </motion.div>
                <motion.div variants={item}>
                  Feedback received!
                </motion.div>
                <motion.div variants={item}>Thank you for your help.</motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Animation variants for the success message
const container = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      staggerChildren: 0.04,
    },
  },
};

const item = {
  hidden: { y: 10 },
  show: { y: 0 },
};

// Custom hook to simulate feedback submission
const useSubmitFeedback = () => {
  const [feedback, setFeedback] = useState<{
    happiness: number;
    feedback: string;
  } | null>(null);
  const [isLoading, setLoadingState] = useState(false);
  const [error, setError] = useState<{ error: any } | null>(null);
  const [isSent, setRequestState] = useState(false);

  // Fake API call
  const submitFeedback = (feedback: { happiness: number; feedback: string }) =>
    new Promise((res) => setTimeout(() => res(feedback), 1000));

  useEffect(() => {
    if (feedback) {
      setLoadingState(true);
      setRequestState(false);

      submitFeedback(feedback)
        .then(() => {
          setRequestState(true);
          setError(null);
        })
        .catch(() => {
          setRequestState(false);
          setError({ error: "An error occurred." });
        })
        .finally(() => setLoadingState(false));
    }
  }, [feedback]);

  return {
    submitFeedback: (happiness: number, feedback: string) =>
      setFeedback({ happiness, feedback }),
    isLoading,
    error,
    isSent,
  };
};
