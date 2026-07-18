// One-off: populate Drawing Set design metadata + create Selia.
// Run from the server/ directory:  node scripts/seed-drawingset.mjs
import "dotenv/config";
import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;
if (!DB_URI) {
  console.error("DB_URI not set (expected in server/.env)");
  process.exit(1);
}

const Project = mongoose.model(
  "Project",
  new mongoose.Schema({}, { strict: false, collection: "projects" })
);

const flagshipUpdates = [
  {
    match: /^beusun$/i,
    set: {
      kind: "personal", client: "Personal", role: "Sole engineer", status: "pre-launch",
      featured: true, order: 0,
      disciplines: ["WEB", "APP", "API", "DB", "PAY", "OPS"],
      lang: ["Next.js", "Expo", "React Native", "NestJS", "TypeScript", "MongoDB", "Tailwind", "TanStack Query", "Stripe", "Zustand"],
      description: "<p>A marketplace that blends <strong>Amazon and Instagram</strong>: businesses spin up their own storefronts, promote products, manage orders, take payments, and coordinate warehouse packaging and delivery. Web app + native mobile app + backend, taken from concept to build.</p>",
    },
  },
  {
    match: /^offload$/i,
    set: {
      kind: "client", client: "Client · DRTS", role: "Lead engineer", status: "pre-launch",
      featured: true, order: 1,
      disciplines: ["WEB", "APP", "API", "DB", "PAY", "OPS"],
      lang: ["React Native", "Expo", "NestJS", "TypeScript", "PostgreSQL", "Stripe", "Google Maps", "AWS S3", "Socket.io"],
      description: "<p><strong>Uber Eats, but for local laundry businesses</strong> instead of restaurants. It handles pickups, customer preferences, payments, order processing, real-time tracking and delivery — customer app, business dashboard and driver flow, with live updates over Socket.io.</p>",
    },
  },
  {
    match: /^tudelu$/i,
    set: {
      kind: "employer", client: "Employer", role: "Lead Software Engineer & System Architect", status: "live",
      featured: true, order: 2,
      disciplines: ["WEB", "API", "DB", "PAY", "OPS", "3D"],
      lang: ["Next.js", "NestJS", "TypeScript", "PostgreSQL", "Tailwind", "Zustand", "Three.js", "Stripe", "AWS S3"],
      description: "<p>When Tudelü and the newly-acquired <strong>Duralux</strong> were split across HubSpot, Trello and a patchwork of separate task managers — duplicated data, no single source of truth, and roughly <strong>$10,000/month</strong> in software costs — <strong>I proposed, designed and built one centralized platform from scratch</strong>: design, frontend, backend, database, deployment and architecture. Consolidating everything into it <strong>cut that recurring cost dramatically</strong>.</p><p>It now runs sales, customers, quotes, orders, inventory, purchasing, invoicing, e-commerce, manufacturing, shipping and warehouse operations — including the MES that guides the production floor through scanning, cutting, assembly and shipping.</p>",
    },
  },
  {
    match: /^precision\s*ops$/i,
    set: {
      kind: "client", client: "Client · DRTS", role: "Sole engineer", status: "live",
      featured: true, order: 3,
      disciplines: ["WEB", "API", "DB", "PAY", "OPS"],
      lang: ["Next.js", "React", "TypeScript", "Tailwind", "shadcn/ui", "NestJS", "Prisma", "PostgreSQL", "Supabase", "Stripe", "SendGrid", "AWS S3"],
      description: "<p>A dual-mode SaaS for solopreneurs with a <strong>Business / Personal toggle</strong> that switches the whole interface. Business mode: CRM, tasks (List + Kanban), projects, calendar, notes and team roles. Personal mode: family tasks and checklists. Plus a client portal with file uploads, Stripe subscriptions and transactional email.</p>",
    },
  },
];

const SELIA_DESCRIPTION =
  "<p><strong>Selia</strong> is an AI sales agent delivered as a SaaS product — it takes calls and chats on a company's website, answers product questions, qualifies leads, builds and sends quotes, and escalates to a human when it should.</p>" +
  "<p>I built the agent core with a tool-calling loop and hard price guardrails, a knowledge base with vector search, human escalation with SLAs, and an embeddable chat widget. Every API key (LLM, voice, connectors) is managed from an encrypted admin panel, so the app boots with zero keys and degrades gracefully.</p>" +
  "<p>Stack: NestJS + MongoDB Atlas Vector Search on the backend, Next.js for the widget and dashboard, OpenAI for reasoning and Vapi for voice.</p>";

async function main() {
  await mongoose.connect(DB_URI);
  console.log("connected");

  const sample = await Project.findOne({}).lean();
  if (!sample) throw new Error("No projects found — is DB_URI correct?");
  const userId = sample.user;
  console.log("using user:", String(userId));

  for (const u of flagshipUpdates) {
    const res = await Project.updateOne({ name: u.match }, { $set: u.set });
    console.log(`update ${u.match}: matched=${res.matchedCount} modified=${res.modifiedCount}`);
  }

  const selia = await Project.findOneAndUpdate(
    { name: /^selia$/i },
    {
      $set: {
        name: "Selia",
        description: SELIA_DESCRIPTION,
        url: "https://useselia.com",
        date: 2026,
        kind: "personal", client: "Personal", role: "Sole engineer", status: "frontier",
        featured: true, order: 4, hidden: false,
        disciplines: ["WEB", "API", "DB", "OPS"],
        lang: ["NestJS", "Next.js", "TypeScript", "OpenAI", "MongoDB", "Atlas Vector Search", "Vapi"],
        summary: "An AI sales agent as a SaaS product — voice + chat, an agent core with a tool-calling loop and price guardrails, a knowledge base with vector search, human escalation, and an embeddable widget.",
        user: userId,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("Selia upserted:", String(selia?._id));

  const featured = await Project.find({ featured: true }).select("name order status kind").sort("order").lean();
  console.log("featured now:", featured.map((f) => `${f.order}:${f.name}(${f.kind}/${f.status})`).join("  "));

  await mongoose.disconnect();
  console.log("done");
}

main().catch((e) => { console.error(e); process.exit(1); });
