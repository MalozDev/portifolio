import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Console Login",
  robots: { index: false, follow: false },
};

export default function ConsoleLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
