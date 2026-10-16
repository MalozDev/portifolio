"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FolderKanban, GraduationCap, ImageIcon, LayoutDashboard, LogOut, Menu, Type, X } from "lucide-react";

const NAV = [
  { href: "/console", label: "Dashboard", icon: LayoutDashboard },
  { href: "/console/projects", label: "Projects", icon: FolderKanban },
  { href: "/console/certifications", label: "Certifications", icon: GraduationCap },
  { href: "/console/photos", label: "Photos", icon: ImageIcon },
  { href: "/console/content", label: "Site Content", icon: Type },
];

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/console/login");
    router.refresh();
  }

  return (
    <div className="min-h-svh bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-md p-2 text-muted-foreground hover:text-foreground md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle console menu"
            >
              {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
            <Link
              href="/console"
              className="font-mono text-sm font-semibold text-brand"
            >
              {"<console/>"}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              View site ↗
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
            >
              <LogOut className="size-3.5" />
              Logout
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="border-t border-border bg-card/60 px-4 py-2 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium ${
                  pathname === item.href ? "text-brand" : "text-muted-foreground"
                }`}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-6">
        {/* Desktop sidebar */}
        <aside className="hidden w-52 shrink-0 md:block">
          <nav className="sticky top-20 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-brand/10 text-brand"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
