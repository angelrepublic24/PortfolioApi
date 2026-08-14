// One-off: create the Cibaura project sheet (logo uploaded to Cloudinary),
// finish Selia's sheet, and give Offload + Beusun their website/app links.
// Run from the server/ directory:  node scripts/add-cibaura-and-links.mjs
import "dotenv/config";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

const DB_URI = process.env.DB_URI;
if (!DB_URI) {
  console.error("DB_URI not set (expected in server/.env)");
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const Project = mongoose.model(
  "Project",
  new mongoose.Schema({}, { strict: false, collection: "projects" })
);

const CIBAURA_LOGO = "C:/Projects/Carvia/frontend/public/brand/logo-full.png";

const CIBAURA_DESCRIPTION =
  "<p><strong>Cibaura</strong> is a rent-a-car marketplace. Agencies publish their fleet across branches, travellers search by dates, place and car, and reserve — over three surfaces on one API: a public web marketplace, an agency dashboard (fleet, calendar, branches, incoming requests) and a native customer app.</p>" +
  "<p>The interesting part is what the platform refuses to get wrong. <strong>Double booking is impossible at the database level</strong> — a PostgreSQL exclusion constraint over vehicle × date range, not an application check that a race condition can slip past. Pricing is always computed server-side, card data never touches my servers (gateway tokens only), and every reservation runs a request-to-book flow with authorize → capture, so a traveller is only charged once the agency accepts.</p>" +
  "<p>Around that core: identity verification that gates checkout — no licence, no service — a per-booking chat thread between traveller and agency, role-based access for agency staff scoped to their branches, a wallet/ledger, and door-to-door delivery where the customer picks the address through Google Places, the fee is derived from the distance to the branch, and the exact address stays hidden until the booking is paid.</p>";

const CIBAURA = {
  name: "Cibaura",
  description: CIBAURA_DESCRIPTION,
  summary:
    "A rent-a-car marketplace — web + agency dashboard + native app — where double booking is made impossible by the database itself, pricing is server-side, and every reservation runs request-to-book with authorize → capture.",
  url: "https://cibaura.com",
  date: 2026,
  kind: "personal",
  client: "Personal",
  role: "Sole engineer",
  status: "pre-launch",
  featured: true,
  order: 5,
  hidden: false,
  disciplines: ["WEB", "APP", "API", "DB", "PAY", "OPS"],
  lang: [
    "Next.js", "React", "TypeScript", "Tailwind", "TanStack Query", "Zustand",
    "NestJS", "TypeORM", "PostgreSQL", "Expo", "React Native",
    "Stripe", "Google Maps", "SendGrid",
  ],
};

// Website + Android app for the two products that ship on both surfaces.
const LINK_UPDATES = [
  {
    match: /^offload$/i,
    links: [
      { label: "Website", url: "https://offloadusa.com/" },
      { label: "Android App", url: "https://play.google.com/store/apps/details?id=com.offloadusa.app" },
    ],
  },
  {
    match: /^beusun$/i,
    links: [
      { label: "Website", url: "https://beusun.com/" },
      { label: "Android App", url: "https://play.google.com/store/apps/details?id=com.beusun.app" },
    ],
  },
];

async function main() {
  await mongoose.connect(DB_URI);
  console.log("connected");

  const sample = await Project.findOne({}).lean();
  if (!sample) throw new Error("No projects found — is DB_URI correct?");
  const userId = sample.user;
  console.log("using user:", String(userId));

  // 1. Cibaura logo -> Cloudinary (same folder/options the upload endpoint uses)
  const existingCibaura = await Project.findOne({ name: /^cibaura$/i }).lean();
  let image = existingCibaura?.image ?? null;
  if (!image) {
    const uploaded = await cloudinary.uploader.upload(CIBAURA_LOGO, {
      folder: "Portfolio",
      use_filename: true,
      unique_filename: true,
    });
    image = uploaded.secure_url;
    console.log("logo uploaded:", image);
  } else {
    console.log("logo already set, keeping:", image);
  }

  // 2. Cibaura project sheet
  const cibaura = await Project.findOneAndUpdate(
    { name: /^cibaura$/i },
    { $set: { ...CIBAURA, image, user: userId } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("Cibaura upserted:", String(cibaura?._id));

  // 3. Selia — still in development: no domain, no logo yet.
  const selia = await Project.updateOne(
    { name: /^selia$/i },
    { $set: { status: "in-dev" }, $unset: { url: "", links: "" } }
  );
  console.log(`Selia: matched=${selia.matchedCount} modified=${selia.modifiedCount}`);

  // 4. Website + app links
  for (const u of LINK_UPDATES) {
    const res = await Project.updateOne({ name: u.match }, { $set: { links: u.links } });
    console.log(`links ${u.match}: matched=${res.matchedCount} modified=${res.modifiedCount}`);
  }

  const featured = await Project.find({ featured: true })
    .select("name order status image url links")
    .sort("order")
    .lean();
  console.log("\nfeatured now:");
  for (const f of featured) {
    const links = (f.links ?? []).map((l) => l.label).join(" + ") || (f.url ? "Visit" : "—");
    console.log(`  ${f.order}: ${f.name} (${f.status}) logo=${f.image ? "yes" : "no"} links=${links}`);
  }

  await mongoose.disconnect();
  console.log("done");
}

main().catch((e) => { console.error(e); process.exit(1); });
