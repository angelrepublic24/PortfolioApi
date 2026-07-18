import { Request, Response } from "express";
import SiteContent from "../models/SiteContent";

// Default site copy — used to seed the singleton on first read so the admin has
// something to edit. After that, the DB document is the source of truth.
const DEFAULTS = {
  singleton: "site",
  brand: "A·ALMONTE — THE DRAWING SET",
  name: "Angel Almonte",
  role: "Full-Stack Software Developer & Founder",
  location: "New Jersey, USA",
  rev: "2026.07",
  hero: {
    eyebrow: "A. Almonte · Full-Stack Software Developer & Founder · New Jersey, USA · Sheet 00 — Cover",
    headLead: "Every floor of the stack, built by ",
    headAmber: "one hand.",
    spec: ["Solo", "Web + Mobile + Backend", "Schema → Screen"],
    lede: "Angel Almonte — a full-stack software developer and founder of DRTS, my software studio, based in New Jersey, USA, with 6+ years building the systems that run real businesses. I ship complete products end to end: the web app, the mobile app, and the backend, database, payments and operations beneath them. From schema to screen, one set of hands.",
  },
  coverDisciplines: ["WEB", "APP", "API", "DB", "PAY", "OPS"],
  notes: [
    "Designs and builds <b>complete products</b> — not a layer of one. Every project below is owned from database schema to rendered screen.",
    "Ships across <b>three surfaces at once</b>: web app, native mobile (React Native / Expo), and the backend + database that serve both.",
    "Owns the hard middle: <b>authentication &amp; RBAC from scratch, payments, real-time, and business logic</b> — the parts that need real ownership.",
    "Builds on a <b>modular, feature-first architecture</b> — NestJS modules with clean separation — so a product keeps growing without rotting.",
    "Integrates external services deliberately and sparingly — <b>Stripe, Google Maps, OpenAI, AWS S3, SendGrid</b> — drawn in blue throughout, never confused with owned code.",
    "<b>Sole author</b> of the personal products and client builds here; <b>technical lead</b> where a team is involved.",
  ],
  sectionFloors: [
    { label: "UI", techTop: "Next.js /", techBottom: "Expo · React" },
    { label: "STATE", techTop: "Zustand /", techBottom: "TanStack Q." },
    { label: "API", techTop: "NestJS /", techBottom: "Express" },
    { label: "DOMAIN", techTop: "Services /", techBottom: "modular arch." },
    { label: "DATA", techTop: "PostgreSQL /", techBottom: "MongoDB" },
    { label: "INFRA", techTop: "AWS S3 /", techBottom: "Stripe*" },
  ],
  contact: {
    github: "https://github.com/angelrepublic24",
    githubLabel: "github.com/angelrepublic24",
    linkedin: "https://www.linkedin.com/in/angel-almonte/",
    linkedinLabel: "linkedin.com/in/angel-almonte",
    email: "angelalmonte.dev@gmail.com",
    studio: "https://drts.us",
    studioLabel: "DRTS · drts.us",
  },
  sealText: "ANGEL ALMONTE · FULL-STACK SOFTWARE DEVELOPER · DRTS · ",
};

const get = async (_req: Request, res: Response) => {
  try {
    let doc = await SiteContent.findOne({ singleton: "site" });
    if (!doc) doc = await SiteContent.create(DEFAULTS);
    res.status(200).json({ siteContent: doc });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const PROTECTED = new Set(["_id", "singleton", "createdAt", "updatedAt", "__v"]);
    const set: Record<string, unknown> = {};
    Object.keys(body).forEach((key) => {
      if (!PROTECTED.has(key)) set[key] = body[key];
    });

    const doc = await SiteContent.findOneAndUpdate(
      { singleton: "site" },
      { $set: set },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ ok: true, siteContent: doc });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export { get, update };
