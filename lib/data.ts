export interface Project {
  title: string;
  description: string;
  href?: string;
  tech: string[];
  featured?: boolean;
  /** Optional real screenshot path (e.g. "/projects/foo.png"). */
  image?: string;
  /** Cover art accent colors + pattern for the generated artwork. */
  accent: readonly [string, string];
  pattern: "dots" | "grid" | "waves" | "circles";
}

export const projects: Project[] = [
  {
    title: "Prospect Management System",
    description:
      "A web application designed to help manage prospects, track follow-ups, and organize sales activities.",
    href: "https://my-prospects.vercel.app",
    tech: ["React", "Node.js", "PostgreSQL"],
    featured: true,
    accent: ["#45fe84", "#22d3ee"],
    pattern: "grid",
  },
  {
    title: "Coffers — Personal Finance Tracker",
    description:
      "A personal finance application for tracking income, expenses, budgets, and financial plans.",
    href: "https://coffers-1.vercel.app",
    tech: ["React", "Node.js", "PostgreSQL"],
    featured: true,
    accent: ["#a3e635", "#fbbf24"],
    pattern: "waves",
  },
  {
    title: "Story You — AI Journal",
    description:
      "An AI-powered journaling application designed to make personal reflection more engaging.",
    href: "https://malozdev.github.io/Story-Your-Ai-journal/",
    tech: ["React", "Node.js", "AI"],
    featured: true,
    accent: ["#a78bfa", "#22d3ee"],
    pattern: "circles",
  },
  {
    title: "Pakalale Trading Platform",
    description:
      "A local trading platform built to connect customers with traders in Zambia's popular trading hub, Mu Town.",
    href: "http://16.171.195.51",
    tech: ["Node.js", "PostgreSQL"],
    featured: true,
    accent: ["#45fe84", "#fbbf24"],
    pattern: "dots",
  },
  {
    title: "CenDev Innovations",
    description:
      "A professional website showcasing a software development company's services, portfolio, and team.",
    href: "https://cendev.vercel.app",
    tech: ["React", "Tailwind CSS"],
    accent: ["#22d3ee", "#60a5fa"],
    pattern: "grid",
  },
  {
    title: "Tramo Technology",
    description:
      "A startup website showcasing the company's identity, services, and digital presence.",
    href: "https://tramo-technology.vercel.app",
    tech: ["React", "Tailwind CSS"],
    accent: ["#fb7185", "#a78bfa"],
    pattern: "waves",
  },
  {
    title: "Kubaza Market",
    description:
      "A freelance project focused on an online art marketplace connecting artists with buyers.",
    href: "https://malozdev.github.io/Genesis-Projects/",
    tech: ["HTML5", "CSS3", "JavaScript"],
    accent: ["#fbbf24", "#fb923c"],
    pattern: "circles",
  },
  {
    title: "Makondo Steel Limited",
    description:
      "A responsive corporate website for a steel construction company.",
    href: "https://makondo-steel-limited.web.app/",
    tech: ["HTML5", "CSS3", "JavaScript"],
    accent: ["#60a5fa", "#a78bfa"],
    pattern: "dots",
  },
];

export interface SkillGroup {
  label: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    skills: ["JavaScript", "TypeScript", "Python", "PHP", "SQL"],
  },
  {
    label: "Frontend",
    skills: ["React", "Vite", "Tailwind CSS", "HTML5", "CSS3"],
  },
  {
    label: "Backend",
    skills: ["Node.js", "Express.js", "REST APIs", "Prisma ORM"],
  },
  {
    label: "Databases",
    skills: ["PostgreSQL", "MongoDB", "MySQL", "SQLite", "Firebase"],
  },
  {
    label: "Cloud & Tools",
    skills: ["AWS", "Google Cloud", "Git", "GitHub", "Docker"],
  },
  {
    label: "Systems & Networking",
    skills: [
      "Linux (Ubuntu)",
      "Cisco Networking",
      "TCP/IP",
      "LAN/WAN",
      "Routing & Switching",
      "Broadband Networks",
    ],
  },
  {
    label: "IoT & Embedded",
    skills: ["Arduino", "ESP32", "Raspberry Pi"],
  },
  {
    label: "Data",
    skills: ["Pandas", "NumPy"],
  },
];

export interface Certification {
  title: string;
  issuer: string;
  href?: string;
}

export const certifications: Certification[] = [
  {
    title: "CCNA — Introduction to Networks",
    issuer: "Cisco Networking Academy",
    href: "/certs/ccna-introduction-to-networks.pdf",
  },
  {
    title: "Getting Started with Cisco Packet Tracer",
    issuer: "Cisco Networking Academy",
    href: "/certs/packet-tracer.pdf",
  },
  {
    title: "IT Essentials",
    issuer: "Cisco Networking Academy",
    href: "/certs/it-essentials.pdf",
  },
  {
    title: "NDG Linux Essentials",
    issuer: "Cisco Networking Academy · Linux Foundation",
    href: "/certs/linux-essentials.pdf",
  },
  {
    title: "NDG Linux Unhatched",
    issuer: "Cisco Networking Academy · Linux Foundation",
    href: "/certs/linux-unhatched.pdf",
  },
  {
    title: "Google Cloud Certification",
    issuer: "Google Cloud",
  },
  {
    title: "AWS Certification",
    issuer: "Amazon Web Services",
  },
];

export const contact = {
  name: "Stephan Malobeka",
  location: "Ndola, Zambia",
  phone: "+260 975 623 742",
  phoneHref: "tel:+260975623742",
  email: "malozdev@gmail.com",
  emailHref: "mailto:malozdev@gmail.com",
  github: "https://github.com/MalozDev",
  linkedin: "https://www.linkedin.com/in/stephan-malobeka-154a7b31b/",
  whatsapp: "https://wa.me/260975623742",
  cv: "/cv.pdf",
};
