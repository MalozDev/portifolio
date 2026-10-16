import type { Metadata, Viewport } from "next";
import { Oxanium, Montserrat, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { SiteHeader } from "@/components/site-header";
import { person, siteDescription, siteName, siteUrl } from "@/lib/site";

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-oxanium",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Stephan Malobeka — Computer Systems Engineer & Full-Stack Developer",
    template: "%s | Stephan Malobeka",
  },
  description: siteDescription,
  keywords: [
    "Stephan Malobeka",
    "systemCall",
    "MalozDev",
    "full-stack developer Zambia",
    "JavaScript developer",
    "Node.js",
    "React",
    "computer systems engineer",
    "Ndola developer",
    "telecommunications engineer Zambia",
  ],
  authors: [{ name: person.name, url: person.sameAs[0] }],
  creator: person.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Stephan Malobeka — Computer Systems Engineer & Full-Stack Developer",
    description: siteDescription,
    url: siteUrl,
    siteName: siteName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stephan Malobeka — Computer Systems Engineer & Full-Stack Developer",
    description: siteDescription,
  },
  category: "technology",
};

/* JSON-LD: tells Google exactly who "Stephan Malobeka" is, so the site
   surfaces for name searches (Person + WebSite schema). */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  alternateName: person.alternateName,
  jobTitle: person.jobTitle,
  email: person.email,
  telephone: person.telephone,
  address: person.address,
  url: siteUrl,
  sameAs: person.sameAs,
  worksFor: {
    "@type": "Organization",
    name: "Freelance",
  },
  knowsAbout: [
    "Full-Stack Development",
    "JavaScript",
    "Node.js",
    "React",
    "Computer Networks",
    "Telecommunications",
    "IoT",
    "Cloud Computing",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0b0e14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${oxanium.variable} ${montserrat.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <SiteHeader />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
