import type { Db, Document, ObjectId } from "mongodb";

import { certifications as staticCertifications, contact as staticContact, projects as staticProjects, skillGroups as staticSkillGroups, type Certification, type Project, type SkillGroup } from "@/lib/data";

/* ------------------------------------------------------------------ */
/* Document types                                                      */
/* ------------------------------------------------------------------ */

export interface UserDoc extends Document {
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
}

export interface ProjectDoc extends Document {
  title: string;
  description: string;
  href?: string;
  tech: string[];
  featured: boolean;
  accent: [string, string];
  pattern: "dots" | "grid" | "waves" | "circles";
  imageFileId?: ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CertificationDoc extends Document {
  title: string;
  issuer: string;
  href?: string;
  pdfFileId?: ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExperienceDoc extends Document {
  role: string;
  company: string;
  period: string;
  startDate?: string;
  endDate?: string;
  points: string[];
  highlight?: string;
  imageFileId?: ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  startDate?: string;
  endDate?: string;
  points: string[];
  highlight?: string;
  image?: string;
}

export interface PhotoDoc extends Document {
  fileId: ObjectId;
  alt: string;
  caption?: string;
  order: number;
  createdAt: Date;
}

export interface SiteContentDoc extends Document {
  _id: "site";
  cvFileId?: ObjectId;
  hero: {
    roles: string[];
    bio: string;
    availability: string;
  };
  about: {
    intro: string[];
    quote: string;
  };
  journey: {
    stage: string;
    title: string;
    note: string;
    items: string[];
  }[];
  leadership: { title: string; detail: string }[];
  languages: { name: string; label: string; level: number }[];
  competencies: string[];
  marquee: string[];
  updatedAt: Date;
}

/* ------------------------------------------------------------------ */
/* Static defaults (also the seed values)                              */
/* ------------------------------------------------------------------ */

export const defaultExperiences: Experience[] = [
  {
    role: "Home Broadband Outdoor Unit (ODU) Installer",
    company: "Telecommunications Operator (Confidential)",
    period: "2025 – Present",
    startDate: "2025-12-08",
    endDate: "",
    points: [
      "Install and commission outdoor unit broadband systems.",
      "Conduct customer site surveys and optimize signal performance.",
      "Configure customer networking equipment and validate connectivity.",
      "Troubleshoot installation and connectivity issues.",
      "Ensure high-quality installations and strong customer satisfaction.",
      "Coordinate with technical teams during service activation.",
    ],
    highlight:
      "🏆 Mukali Award — Recognized as a top-performing installer during the quarter for outstanding service delivery.",
  },
  {
    role: "Telecommunications Engineering Intern",
    company: "Baicells Technologies",
    period: "Internship",
    startDate: "2024-01",
    endDate: "2024-12",
    points: [
      "Assisted with monitoring core network systems.",
      "Participated in network troubleshooting and incident resolution.",
      "Supported infrastructure maintenance and upgrades.",
      "Studied mobile telecommunications architecture and best practices.",
      "Collaborated closely with senior network engineers.",
    ],
  },
];

export const defaultContent: SiteContentDoc = {
  _id: "site",
  updatedAt: new Date(0),
  hero: {
    roles: [
      "Full-Stack Developer",
      "Systems Engineer",
      "Telecom Engineer",
      "IoT Builder",
    ],
    bio: "Computer Systems Engineering graduate from the University of Zambia, building real-world software that solves practical problems — from full-stack web apps and REST APIs to IoT systems and telecom networks.",
    availability: "Open to opportunities",
  },
  about: {
    intro: [
      "Better known as systemCall(). I sit at the intersection of software, networking, telecommunications, and intelligent systems — turning ideas into products people can actually use.",
    ],
    quote:
      "I believe in learning by building. Most of my growth comes from experimenting, solving problems, and pushing projects beyond development into real deployments.",
  },
  journey: [
    {
      stage: "01",
      title: "Foundations",
      items: ["Computer Networks", "Software Engineering", "Embedded Systems"],
      note: "Where systems stopped being magic.",
    },
    {
      stage: "02",
      title: "Intelligence",
      items: ["Artificial Intelligence", "Data Mining & Warehousing"],
      note: "Taught machines to find patterns in noise.",
    },
    {
      stage: "03",
      title: "Scale",
      items: ["Cloud Computing", "Distributed Systems", "Wireless Networks"],
      note: 'Learned why "it works on my machine" isn\'t enough.',
    },
  ],
  leadership: [
    {
      title: "UNZA Innovation Challenge",
      detail: "Built technology-driven solutions in the university innovation competition.",
    },
    {
      title: "Entrepreneurship Sandbox Hackathon",
      detail: "Ontario Tech University (Brilliant Catalyst) — multidisciplinary team builds.",
    },
    {
      title: "EO Robotics STEM Workshops",
      detail: "Hands-on robotics and embedded systems with Arduino.",
    },
    {
      title: "Web3 Bootcamp",
      detail: "Blockchain fundamentals and smart contracts in Motoko.",
    },
  ],
  languages: [
    { name: "English", label: "Fluent", level: 100 },
    { name: "Nyanja", label: "Fluent", level: 100 },
    { name: "Bemba", label: "Conversational", level: 65 },
  ],
  competencies: [
    "Full-Stack Web Development",
    "JavaScript Development",
    "Software Engineering",
    "REST API Development",
    "Network Engineering",
    "Cloud Computing",
    "Linux Administration",
    "Database Design",
    "Problem Solving",
    "Technical Documentation",
    "Team Collaboration",
    "Customer Support",
  ],
  marquee: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Express",
    "PostgreSQL",
    "MongoDB",
    "Prisma",
    "Tailwind CSS",
    "Python",
    "AWS",
    "Google Cloud",
    "Docker",
    "Linux",
    "Cisco Networking",
    "Arduino",
    "Raspberry Pi",
  ],
};

export const defaultContact = staticContact;

/* ------------------------------------------------------------------ */
/* Public getters (used by server components)                          */
/* ------------------------------------------------------------------ */

export type { Certification, Project, SkillGroup };
export { staticCertifications, staticContact, staticSkillGroups };

export interface PortfolioData {
  projects: Project[];
  certifications: Certification[];
  experiences: Experience[];
  photos: { id: string; url: string; alt: string; caption?: string }[];
  content: SiteContentDoc;
  contact: typeof staticContact;
}

function serializeProject(doc: ProjectDoc): Project {
  return {
    title: doc.title,
    description: doc.description,
    href: doc.href,
    tech: doc.tech ?? [],
    featured: doc.featured ?? false,
    accent: doc.accent ?? ["#45fe84", "#22d3ee"],
    pattern: doc.pattern ?? "grid",
    image: doc.imageFileId ? `/api/media/${doc.imageFileId.toString()}` : undefined,
  };
}

function serializeCertification(doc: CertificationDoc): Certification {
  return {
    title: doc.title,
    issuer: doc.issuer,
    href: doc.pdfFileId
      ? `/api/media/${doc.pdfFileId.toString()}`
      : doc.href,
  };
}

function serializeExperience(doc: ExperienceDoc): Experience {
  return {
    role: doc.role,
    company: doc.company,
    period: doc.period,
    startDate: doc.startDate,
    endDate: doc.endDate,
    points: doc.points ?? [],
    highlight: doc.highlight,
    image: doc.imageFileId ? `/api/media/${doc.imageFileId.toString()}` : undefined,
  };
}

function parseExperienceDate(value?: string): number {
  if (!value) return 0;
  const match = value.match(/(\d{4})(?:-(\d{2}))?/);
  if (!match) return 0;
  const year = Number(match[1]);
  const month = match[2] ? Number(match[2]) : 1;
  return year * 12 + (month - 1);
}

export function isCurrentExperience(endDate?: string): boolean {
  const value = (endDate ?? "").trim().toLowerCase();
  return value === "" || value === "present" || value === "current" || value === "now";
}

export function sortExperiencesByRecency<T extends { startDate?: string; endDate?: string }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    const aCurrent = isCurrentExperience(a.endDate) ? 1 : 0;
    const bCurrent = isCurrentExperience(b.endDate) ? 1 : 0;
    if (aCurrent !== bCurrent) return bCurrent - aCurrent;

    const aEnd = isCurrentExperience(a.endDate)
      ? Number.MAX_SAFE_INTEGER
      : parseExperienceDate(a.endDate);
    const bEnd = isCurrentExperience(b.endDate)
      ? Number.MAX_SAFE_INTEGER
      : parseExperienceDate(b.endDate);
    if (aEnd !== bEnd) return bEnd - aEnd;

    return parseExperienceDate(b.startDate) - parseExperienceDate(a.startDate);
  });
}

export function formatExperiencePeriod(exp: {
  period?: string;
  startDate?: string;
  endDate?: string;
}): string {
  if (exp.period && exp.period.trim()) return exp.period;
  const start = exp.startDate?.trim();
  const end = exp.endDate?.trim();
  if (!start && !end) return "";
  const endLabel = isCurrentExperience(end) ? "Present" : end || "Present";
  return start ? `${start} – ${endLabel}` : endLabel;
}

function parseExperienceDateObject(value?: string): Date | null {
  if (!value) return null;
  const match = value.match(/(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = match[2] ? Number(match[2]) - 1 : 0;
  const day = match[3] ? Number(match[3]) : 1;
  const date = new Date(year, month, day);
  return isNaN(date.getTime()) ? null : date;
}

export function experienceDuration(exp: {
  startDate?: string;
  endDate?: string;
}): string {
  const start = parseExperienceDateObject(exp.startDate);
  if (!start) return "";
  const end = isCurrentExperience(exp.endDate)
    ? new Date()
    : parseExperienceDateObject(exp.endDate);
  if (!end || end < start) return "";

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  if (days < 0) {
    months -= 1;
    const previousMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += previousMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years === 1 ? "" : "s"}`);
  if (months > 0) parts.push(`${months} month${months === 1 ? "" : "s"}`);
  if (days > 0 && years === 0) parts.push(`${days} day${days === 1 ? "" : "s"}`);
  return parts.join(" ") || "< 1 day";
}

/**
 * Load the full portfolio dataset from MongoDB.
 * Falls back to the static defaults when the DB is empty or unreachable,
 * so the site keeps working before (or without) seeding.
 */
export async function getPortfolio(db: Db | Promise<Db>): Promise<PortfolioData> {
  try {
    const database = await db;
    const [projectDocs, certDocs, experienceDocs, photoDocs, contentDoc] = await Promise.all([
      database.collection<ProjectDoc>("projects").find().sort({ order: 1 }).toArray(),
      database
        .collection<CertificationDoc>("certifications")
        .find()
        .sort({ order: 1 })
        .toArray(),
      database
        .collection<ExperienceDoc>("experiences")
        .find()
        .sort({ order: 1 })
        .toArray(),
      database.collection<PhotoDoc>("photos").find().sort({ order: 1 }).toArray(),
      database.collection<SiteContentDoc>("content").findOne({ _id: "site" }),
    ]);

    const projects =
      projectDocs.length > 0 ? projectDocs.map(serializeProject) : staticProjects;
    const certifications =
      certDocs.length > 0 ? certDocs.map(serializeCertification) : staticCertifications;
    const experiences =
      experienceDocs.length > 0
        ? sortExperiencesByRecency(experienceDocs.map(serializeExperience))
        : sortExperiencesByRecency(defaultExperiences);
    const photos =
      photoDocs.length > 0
        ? photoDocs.map((p) => ({
            id: p.fileId.toString(),
            url: `/api/media/${p.fileId.toString()}`,
            alt: p.alt,
            caption: p.caption,
          }))
        : [
            { id: "static-1", url: "/welcome-image.jpeg", alt: "Stephan Malobeka" },
            {
              id: "static-2",
              url: "/welcome-black-n-white.jpeg",
              alt: "Stephan Malobeka, black and white portrait",
            },
          ];

    return {
      projects,
      certifications,
      experiences,
      photos,
      content: contentDoc ?? defaultContent,
      contact: {
        ...staticContact,
        cv: contentDoc?.cvFileId
          ? `/api/media/${contentDoc.cvFileId.toString()}`
          : staticContact.cv,
      },
    };
  } catch {
    // DB unreachable — serve the static defaults so the site never breaks.
    return {
      projects: staticProjects,
      certifications: staticCertifications,
      experiences: defaultExperiences,
      photos: [
        { id: "static-1", url: "/welcome-image.jpeg", alt: "Stephan Malobeka" },
        {
          id: "static-2",
          url: "/welcome-black-n-white.jpeg",
          alt: "Stephan Malobeka, black and white portrait",
        },
      ],
      content: defaultContent,
      contact: staticContact,
    };
  }
}
