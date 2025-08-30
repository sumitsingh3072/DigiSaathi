"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dock, DockIcon } from "@/components/magicui/dock";
import {
  LayoutGrid,
  MessageSquare,
  IndianRupee,
  UserCheck,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../ui/mode-toggle";

export function Navbar() {
  const pathname = usePathname();

  // Navigation links for the DigiSaathi application
  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutGrid className="size-full" /> },
    { href: "/chat", label: "Chat Assistant", icon: <MessageSquare className="size-full" /> },
    { href: "/payments", label: "Payments", icon: <IndianRupee className="size-full" /> },
    { href: "/kyc", label: "KYC Verification", icon: <UserCheck className="size-full" /> },
    { href: "/education", label: "Learn", icon: <GraduationCap className="size-full" /> },
  ];

  return (
    // This div positions the dock at the bottom of the screen.
    <div className="fixed inset-x-0 bottom-5 z-50">
      <Dock iconMagnification={60} iconDistance={100}>
        {/* Map through the navigation links */}
        {navLinks.map((link) => (
          <DockIcon
            key={link.href}
            className={cn(
              "bg-black/10 dark:bg-white/10",
              // Highlight the active link
              pathname === link.href && "bg-black/20 dark:bg-white/20",
            )}
          >
            <Link href={link.href} className="flex size-full items-center justify-center" aria-label={link.label}>
              {link.icon}
            </Link>
          </DockIcon>
        ))}
        
        {/* Add the ModeToggle component to the dock */}
        <DockIcon className="bg-black/10 dark:bg-white/10">
          <ModeToggle />
        </DockIcon>
      </Dock>
    </div>
  );
}
