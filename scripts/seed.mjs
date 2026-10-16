/**
 * Seed the portfolio database.
 *
 * Usage:  node scripts/seed.mjs
 *
 * - Creates the console admin user (malozdev@gmail.com / <stephDev/>@1028)
 * - Inserts site content, projects, certifications, photos
 * - Uploads certificate PDFs + CV + welcome photos into GridFS
 *
 * Safe to re-run: existing documents are kept (user password is reset).
 */
import { MongoClient, GridFSBucket } from "mongodb";
import { randomBytes, scryptSync } from "crypto";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/* Load .env manually (plain node has no dotenv) */
function loadEnv() {
  const envPath = resolve(root, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)="?(.*?)"?\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
}
loadEnv();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI missing — check .env");
  process.exit(1);
}
const dbName = process.env.MONGODB_DB || "portfolio";

/* Same algorithm as lib/auth.ts */
function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const ADMIN = {
  email: "malozdev@gmail.com",
  password: "<stephDev/>@1028",
  name: "Stephan Malobeka",
};

const DEFAULT_CONTENT = {
  _id: "site",
  hero: {
    roles: ["Full-Stack Developer", "Systems Engineer", "Telecom Engineer", "IoT Builder"],
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
    { title: "UNZA Innovation Challenge", detail: "Built technology-driven solutions in the university innovation competition." },
    { title: "Entrepreneurship Sandbox Hackathon", detail: "Ontario Tech University (Brilliant Catalyst) — multidisciplinary team builds." },
    { title: "EO Robotics STEM Workshops", detail: "Hands-on robotics and embedded systems with Arduino." },
    { title: "Web3 Bootcamp", detail: "Blockchain fundamentals and smart contracts in Motoko." },
  ],
  languages: [
    { name: "English", label: "Fluent", level: 100 },
    { name: "Nyanja", label: "Fluent", level: 100 },
    { name: "Bemba", label: "Conversational", level: 65 },
  ],
  competencies: [
    "Full-Stack Web Development", "JavaScript Development", "Software Engineering",
    "REST API Development", "Network Engineering", "Cloud Computing",
    "Linux Administration", "Database Design", "Problem Solving",
    "Technical Documentation", "Team Collaboration", "Customer Support",
  ],
  marquee: [
    "JavaScript", "TypeScript", "React", "Node.js", "Express", "PostgreSQL",
    "MongoDB", "Prisma", "Tailwind CSS", "Python", "AWS", "Google Cloud",
    "Docker", "Linux", "Cisco Networking", "Arduino", "Raspberry Pi",
  ],
  updatedAt: new Date(),
};

const PROJECTS = [
  {
    title: "Prospect Management System",
    description: "A web application designed to help manage prospects, track follow-ups, and organize sales activities.",
    href: "https://my-prospects.vercel.app",
    tech: ["React", "Node.js", "PostgreSQL"], featured: true,
    accent: ["#45fe84", "#22d3ee"], pattern: "grid",
  },
  {
    title: "Coffers — Personal Finance Tracker",
    description: "A personal finance application for tracking income, expenses, budgets, and financial plans.",
    href: "https://coffers-1.vercel.app",
    tech: ["React", "Node.js", "PostgreSQL"], featured: true,
    accent: ["#a3e635", "#fbbf24"], pattern: "waves",
  },
  {
    title: "Story You — AI Journal",
    description: "An AI-powered journaling application designed to make personal reflection more engaging.",
    href: "https://malozdev.github.io/Story-Your-Ai-journal/",
    tech: ["React", "Node.js", "AI"], featured: true,
    accent: ["#a78bfa", "#22d3ee"], pattern: "circles",
  },
  {
    title: "Pakalale Trading Platform",
    description: "A local trading platform built to connect customers with traders in Zambia's popular trading hub, Mu Town.",
    href: "http://16.171.195.51",
    tech: ["Node.js", "PostgreSQL"], featured: true,
    accent: ["#45fe84", "#fbbf24"], pattern: "dots",
  },
  {
    title: "CenDev Innovations",
    description: "A professional website showcasing a software development company's services, portfolio, and team.",
    href: "https://cendev.vercel.app",
    tech: ["React", "Tailwind CSS"], featured: false,
    accent: ["#22d3ee", "#60a5fa"], pattern: "grid",
  },
  {
    title: "Tramo Technology",
    description: "A startup website showcasing the company's identity, services, and digital presence.",
    href: "https://tramo-technology.vercel.app",
    tech: ["React", "Tailwind CSS"], featured: false,
    accent: ["#fb7185", "#a78bfa"], pattern: "waves",
  },
  {
    title: "Kubaza Market",
    description: "A freelance project focused on an online art marketplace connecting artists with buyers.",
    href: "https://malozdev.github.io/Genesis-Projects/",
    tech: ["HTML5", "CSS3", "JavaScript"], featured: false,
    accent: ["#fbbf24", "#fb923c"], pattern: "circles",
  },
  {
    title: "Makondo Steel Limited",
    description: "A responsive corporate website for a steel construction company.",
    href: "https://makondo-steel-limited.web.app/",
    tech: ["HTML5", "CSS3", "JavaScript"], featured: false,
    accent: ["#60a5fa", "#a78bfa"], pattern: "dots",
  },
];

const CERTIFICATES = [
  { title: "CCNA — Introduction to Networks", issuer: "Cisco Networking Academy", file: "public/certs/ccna-introduction-to-networks.pdf" },
  { title: "Getting Started with Cisco Packet Tracer", issuer: "Cisco Networking Academy", file: "public/certs/packet-tracer.pdf" },
  { title: "IT Essentials", issuer: "Cisco Networking Academy", file: "public/certs/it-essentials.pdf" },
  { title: "NDG Linux Essentials", issuer: "Cisco Networking Academy · Linux Foundation", file: "public/certs/linux-essentials.pdf" },
  { title: "NDG Linux Unhatched", issuer: "Cisco Networking Academy · Linux Foundation", file: "public/certs/linux-unhatched.pdf" },
  { title: "Google Cloud Certification", issuer: "Google Cloud", file: null },
  { title: "AWS Certification", issuer: "Amazon Web Services", file: null },
];

const PHOTOS = [
  { file: "public/welcome-image.jpeg", alt: "Stephan Malobeka" },
  { file: "public/welcome-black-n-white.jpeg", alt: "Stephan Malobeka, black and white portrait" },
];

async function uploadToGridFS(bucket, filePath, contentType) {
  const buffer = readFileSync(filePath);
  const stream = bucket.openUploadStream(filePath.split("/").pop(), { contentType });
  await new Promise((res, rej) => {
    stream.end(buffer, () => (stream.finished ? res() : null));
    stream.on("finish", res);
    stream.on("error", rej);
  });
  return stream.id;
}

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db(dbName);
  console.log(`Connected → ${dbName}`);

  /* 1. Admin user (always reset password so the seed stays deterministic) */
  await db.collection("users").updateOne(
    { email: ADMIN.email },
    {
      $set: {
        email: ADMIN.email,
        passwordHash: hashPassword(ADMIN.password),
        name: ADMIN.name,
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );
  console.log(`✓ admin user: ${ADMIN.email}`);

  /* 2. Site content */
  const contentCount = await db.collection("content").countDocuments();
  if (contentCount === 0) {
    await db.collection("content").insertOne(DEFAULT_CONTENT);
    console.log("✓ site content seeded");
  } else {
    console.log("· site content already present — skipped");
  }

  /* 3. Projects */
  const projectCount = await db.collection("projects").countDocuments();
  if (projectCount === 0) {
    const now = new Date();
    await db.collection("projects").insertMany(
      PROJECTS.map((p, i) => ({ ...p, order: i, createdAt: now, updatedAt: now }))
    );
    console.log(`✓ ${PROJECTS.length} projects seeded`);
  } else {
    console.log("· projects already present — skipped");
  }

  /* 4. Certifications (upload PDFs to GridFS) */
  const certCount = await db.collection("certifications").countDocuments();
  if (certCount === 0) {
    const bucket = new GridFSBucket(db, { bucketName: "media" });
    const now = new Date();
    const docs = [];
    for (const [i, cert] of CERTIFICATES.entries()) {
      let pdfFileId;
      if (cert.file && existsSync(resolve(root, cert.file))) {
        pdfFileId = await uploadToGridFS(bucket, resolve(root, cert.file), "application/pdf");
      }
      docs.push({
        title: cert.title,
        issuer: cert.issuer,
        pdfFileId,
        href: pdfFileId ? undefined : undefined,
        order: i,
        createdAt: now,
        updatedAt: now,
      });
    }
    await db.collection("certifications").insertMany(docs);
    console.log(`✓ ${docs.length} certifications seeded (${docs.filter((d) => d.pdfFileId).length} with PDFs)`);
  } else {
    console.log("· certifications already present — skipped");
  }

  /* 5. Photos for the About slider */
  const photoCount = await db.collection("photos").countDocuments();
  if (photoCount === 0) {
    const bucket = new GridFSBucket(db, { bucketName: "media" });
    const docs = [];
    for (const [i, photo] of PHOTOS.entries()) {
      const path = resolve(root, photo.file);
      if (!existsSync(path)) {
        console.warn(`· missing ${photo.file} — skipped`);
        continue;
      }
      const fileId = await uploadToGridFS(bucket, path, "image/jpeg");
      docs.push({ fileId, alt: photo.alt, order: i, createdAt: new Date() });
    }
    if (docs.length) await db.collection("photos").insertMany(docs);
    console.log(`✓ ${docs.length} photos seeded`);
  } else {
    console.log("· photos already present — skipped");
  }

  console.log("\nSeed complete. Console: /console/login");
} catch (err) {
  console.error("Seed failed:", err);
  process.exitCode = 1;
} finally {
  await client.close();
}
