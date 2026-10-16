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

/**
 * Load the full portfolio dataset from MongoDB.
 * Falls back to the static defaults when the DB is empty or unreachable,
 * so the site keeps working before (or without) seeding.
 */
export async function getPortfolio(db: Db): Promise<PortfolioData> {
  try {
    const [projectDocs, certDocs, photoDocs, contentDoc] = await Promise.all([
      db.collection<ProjectDoc>("projects").find().sort({ order: 1 }).toArray(),
      db
        .collection<CertificationDoc>("certifications")
        .find()
        .sort({ order: 1 })
        .toArray(),
      db.collection<PhotoDoc>("photos").find().sort({ order: 1 }).toArray(),
      db.collection<SiteContentDoc>("content").findOne({ _id: "site" }),
    ]);

    const projects =
      projectDocs.length > 0 ? projectDocs.map(serializeProject) : staticProjects;
    const certifications =
      certDocs.length > 0 ? certDocs.map(serializeCertification) : staticCertifications;
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
