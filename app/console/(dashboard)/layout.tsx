import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/auth";
import { ConsoleShell } from "@/components/console/shell";

export const metadata: Metadata = {
  title: "Console — Stephan Malobeka",
  robots: { index: false, follow: false },
};

export default async function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    redirect("/console/login");
  }

  return <ConsoleShell>{children}</ConsoleShell>;
}
