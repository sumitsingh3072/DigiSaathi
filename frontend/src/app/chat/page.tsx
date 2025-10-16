/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ScanLine,
  ShieldCheck,
  IndianRupee,
  MessageSquare,
  ArrowUpIcon,
  Paperclip,
  Mic,
  Bot,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/api";
import { getToken } from "@/utils/auth";

// --- Auto-resize hook for textarea ---
const useAutoResizeTextarea = ({
  minHeight = 60,
  maxHeight = 200,
}: {
  minHeight?: number;
  maxHeight?: number;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = (reset = false) => {
    const textarea = textareaRef.current;
    if (textarea) {
      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }
      textarea.style.height = "auto";
      const newHeight = Math.min(
        Math.max(textarea.scrollHeight, minHeight),
        maxHeight
      );
      textarea.style.height = `${newHeight}px`;
    }
  };

  return { textareaRef, adjustHeight };
};

// --- Message Interface ---
interface Message {
  sender: "user" | "bot";
  text: string;
}

// --- Main Component ---
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "👋 Hello! I'm DigiSaathi. I can help you pay bills, check balances, analyze documents, or detect frauds. How can I assist today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({});
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // --- Scroll to latest message automatically ---
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // --- Handle message sending ---
  const handleSend = async () => {
    if (input.trim() === "" || loading) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    adjustHeight(true);

    const token = getToken();
    if (!token) {
      toast.error("Not Logged In", {
        description: "Please log in to chat with DigiSaathi.",
      });
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/chat/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.detail || "Failed to get response.");
      }

      const data = await res.json();
      const botMessage: Message = {
        sender: "bot",
        text: data?.response || "Sorry, I couldn’t understand that.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      toast.error("Chat Error", {
        description: err.message || "Something went wrong. Please try again.",
      });
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Could not connect to the server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // --- Handle Enter key ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center p-4 py-8 sm:space-y-4">
      <h1 className="text-foreground text-center text-2xl font-bold sm:text-4xl flex items-center gap-2">
        <MessageSquare className="text-green-500" />
        Ask DigiSaathi Anything
      </h1>

      {/* --- Chat Messages --- */}
      <div
        ref={chatContainerRef}
        className="w-full h-[50vh] overflow-y-auto space-y-4 p-4 my-4 rounded-lg bg-secondary/20 border border-border"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "justify-end" : ""
            }`}
          >
            {msg.sender === "bot" && (
              <Bot className="w-6 h-6 text-green-500 flex-shrink-0" />
            )}
            <div
              className={cn(
                "rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-line break-words",
                msg.sender === "user"
                  ? "bg-green-600 text-white"
                  : "bg-card text-foreground"
              )}
            >
              {msg.text}
            </div>
            {msg.sender === "user" && (
              <User className="w-6 h-6 text-gray-500 flex-shrink-0" />
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-green-500" />
            <div className="bg-card rounded-lg px-4 py-2 text-sm flex items-center gap-2">
              <Loader2 className="animate-spin h-4 w-4 text-green-500" />
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* --- Input Box --- */}
      <div className="w-full">
        <div className="border-border bg-secondary/20 relative rounded-xl border">
          <div className="overflow-y-auto">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e: { target: { value: SetStateAction<string> } }) => {
                setInput(e.target.value);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask me to pay your electricity bill..."
              className={cn(
                "w-full px-4 py-3 resize-none bg-transparent border-none text-sm",
                "focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-sm min-h-[60px]"
              )}
              style={{ overflow: "hidden" }}
            />
          </div>

          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="group hover:bg-secondary/50 flex items-center gap-1 rounded-lg p-2"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="group hover:bg-secondary/50 flex items-center gap-1 rounded-lg p-2"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className={cn(
                  "flex items-center justify-center rounded-lg p-2 transition-colors",
                  input.trim() && !loading
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-secondary text-muted-foreground cursor-not-allowed"
                )}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUpIcon className="h-4 w-4" />
                )}
                <span className="sr-only">Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- Quick Action Buttons --- */}
        <div className="-mx-4 mt-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex flex-col flex-wrap items-start gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-3 sm:overflow-x-auto sm:pb-2">
            <ActionButton
              icon={<ScanLine className="h-4 w-4" />}
              label="Scan a Bill or QR"
              onClick={() => router.push("/expense-upload")}
            />
            <ActionButton
              icon={<IndianRupee className="h-4 w-4" />}
              label="Check Balance"
              onClick={() => router.push("/dashboard")}
            />
            <ActionButton
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Check for Scams"
              onClick={() => router.push("/fraud-checker")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Action Button Component ---
interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function ActionButton({ icon, label, onClick }: ActionButtonProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      onClick={onClick}
      className="border-border bg-secondary/20 flex w-full flex-shrink-0 items-center gap-2 rounded-full border px-3 py-2 whitespace-nowrap transition-colors hover:bg-secondary/50 sm:w-auto sm:px-4"
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Button>
  );
}
