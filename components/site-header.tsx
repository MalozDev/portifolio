"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from "@/components/social-icons";
import { PendingLabel } from "@/components/link-pending";
import { contact } from "@/lib/data";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/certification", label: "Certifications" },
  { href: "/experience", label: "Experience" },
  { href: "/skills", label: "Skills" },
];

const socialLinks = [
  { label: "GitHub", href: contact.github, Icon: GitHubIcon },
  { label: "LinkedIn", href: contact.linkedin, Icon: LinkedInIcon },
  { label: "WhatsApp", href: contact.whatsapp, Icon: WhatsAppIcon },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/console")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex min-h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
        {/* Left: mobile menu + logo */}
        <div className="flex min-w-0 items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              render={
                <Button variant="ghost" size="icon" className="lg:hidden" />
              }
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="sr-only">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Site navigation links.</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-muted hover:text-foreground ${
                      pathname === link.href ? "text-brand" : ""
                    }`}
                  >
                    <PendingLabel>{link.label}</PendingLabel>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link
            href="/"
            className="group ml-[30px] flex items-center gap-0.5 whitespace-nowrap font-mono text-xs font-semibold transition-colors sm:gap-1 sm:text-sm lg:ml-0 lg:text-base"
            aria-label="Stephan Malobeka — home"
          >
            <span className="text-muted-foreground/70 transition-colors group-hover:text-muted-foreground">
              &lt;
            </span>
            <span className="bg-gradient-to-r from-brand via-[oklch(0.8_0.18_190)] to-brand bg-[length:200%_auto] bg-clip-text text-transparent animate-text-shimmer">
              Stephan
            </span>
            <span className="bg-gradient-to-r from-[oklch(0.75_0.16_250)] via-[oklch(0.72_0.16_300)] to-[oklch(0.75_0.16_250)] bg-[length:200%_auto] bg-clip-text text-transparent animate-text-shimmer [animation-delay:0.8s]">
              Malobeka
            </span>
            <span className="text-muted-foreground/70 transition-colors group-hover:text-muted-foreground">
              /&gt;
            </span>
          </Link>
        </div>

        {/* Right: desktop nav + socials */}
        <div className="flex min-w-0 items-center justify-end gap-2">
          <nav className="hidden min-w-0 flex-nowrap items-center gap-0 lg:flex" aria-label="Main"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-lg px-1.5 py-2 text-xs font-medium transition-colors hover:bg-muted hover:text-foreground lg:px-2 lg:text-sm ${
                  pathname === link.href
                    ? "text-brand"
                    : "text-muted-foreground"
                }`}
              >
                <PendingLabel>{link.label}</PendingLabel>
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-0.5 sm:gap-1">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="p-1 text-muted-foreground transition-colors hover:text-brand sm:p-1.5"
            >
              <social.Icon className="size-4" />
            </a>
          ))}
          <a
            href={contact.emailHref}
            aria-label="Email"
            className="p-1 text-muted-foreground transition-colors hover:text-brand sm:p-1.5"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
        </div>
        </div>
      </div>
    </header>
  );
}
