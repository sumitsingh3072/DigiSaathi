"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { Home, Compass, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../ui/mode-toggle";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home", icon: <Home className="size-full" /> },
    { href: "/explore", label: "Explore", icon: <Compass className="size-full" /> },
    { href: "/profile", label: "Profile", icon: <User className="size-full" />},
  ];

  return (
    <div className="fixed inset-x-0 bottom-5 z-50 flex justify-center">
      <Dock iconMagnification={60} iconDistance={100}>
        {navLinks.map((link) => (
          <DockIcon
            key={link.href}
            className={cn(
              "bg-black/10 dark:bg-white/10 backdrop-blur-md border border-white/10 shadow-lg",
              "hover:bg-emerald-500/20 transition-all duration-300",
              pathname === link.href && "bg-emerald-500/30 dark:bg-emerald-500/40"
            )}
          >
            <Link
              href={link.href}
              className="flex size-full items-center justify-center"
              aria-label={link.label}
            >
              {link.icon}
            </Link>
          </DockIcon>
        ))}

        {/* Mode Toggle */}
        <DockIcon className="bg-black/10 dark:bg-white/10 backdrop-blur-md border border-white/10 shadow-lg">
          <ModeToggle />
        </DockIcon>
      </Dock>
    </div>
  );
}
