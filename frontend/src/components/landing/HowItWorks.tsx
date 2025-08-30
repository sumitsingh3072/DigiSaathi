"use client";

import React from "react";
import { WobbleCard } from "../ui/wobble-card";
import { ScanText, MessageSquare, ShieldCheck } from "lucide-react";

export function HowItWorks() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-green-500/20 backdrop-blur-lg border border-white/10 min-h-[500px] lg:min-h-[300px]"
        className=""
      >
        <div className="max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] flex items-center gap-2">
            <MessageSquare />
            Step 1: Chat in Your Language
          </h2>
          <p className="mt-4 text-left text-base/6">
            Start a conversation with your DigiSaathi assistant. Just type or speak in Hindi, English, or your regional language to ask questions, check your balance, or get help.
          </p>
        </div>
        {/* Replaced image with a large, stylized Lucide icon */}
        <MessageSquare className="absolute -right-4 lg:-right-[10%] -bottom-10 h-1/2 w-1/2 text-green-500/30" strokeWidth={1.5} />
      </WobbleCard>
      <WobbleCard 
        containerClassName="col-span-1 min-h-[300px] bg-slate-800/20 backdrop-blur-lg border border-white/10"
      >
        <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em]  flex items-center gap-2">
          <ScanText />
          Step 2: Scan Documents
        </h2>
        <p className="mt-4 max-w-[26rem] text-left text-base/6">
          Need to complete KYC or pay a bill? Just take a photo. Our AI will read the details for you, saving you time and effort.
        </p>
        {/* Added a background icon for consistency */}
        <ScanText className="absolute -right-4 -bottom-10 h-1/2 w-1/2 text-white/10" strokeWidth={1.5} />
      </WobbleCard>
      <WobbleCard 
        containerClassName="col-span-1 lg:col-span-3 bg-blue-500/20 backdrop-blur-lg border border-white/10 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]"
      >
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] flex items-center gap-2">
            <ShieldCheck />
            Step 3: Transact Safely
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6">
            Confirm payments and other transactions with confidence. DigiSaathi guides you through each step and alerts you to potential scams, keeping your money secure.
          </p>
        </div>
        {/* Replaced image with a large, stylized Lucide icon */}
        <ShieldCheck className="absolute -right-10 md:-right-[20%] -bottom-10 h-2/3 w-2/3 text-blue-500/30" strokeWidth={1.5} />
      </WobbleCard>
    </div>
  );
}
