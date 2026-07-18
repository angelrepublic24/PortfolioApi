import "dotenv/config";
import mongoose from "mongoose";

const SiteContent = mongoose.model("SiteContent", new mongoose.Schema({}, { strict: false, collection: "sitecontents" }));
const Experience = mongoose.model("Experience", new mongoose.Schema({}, { strict: false, collection: "experiences" }));

const LEDE =
  "Angel Almonte — a full-stack software developer and founder of DRTS, my software studio, based in New Jersey, USA, with 6+ years building the systems that run real businesses. I ship complete products end to end: the web app, the mobile app, and the backend, database, payments and operations beneath them. From schema to screen, one set of hands.";

const DRTS_SCOPE = "Founded DRTS (2024) — a software studio shipping web & mobile products for clients (Offload, Precision Ops).";

async function main() {
  await mongoose.connect(process.env.DB_URI);

  const s = await SiteContent.updateOne({ singleton: "site" }, { $set: { "hero.lede": LEDE } });
  console.log("SiteContent hero.lede:", s.matchedCount, s.modifiedCount);

  const e = await Experience.updateOne(
    { company: /development real time|drts/i },
    { $set: { scope: DRTS_SCOPE } }
  );
  console.log("DRTS experience scope:", e.matchedCount, e.modifiedCount);

  await mongoose.disconnect();
}
main().catch((err) => { console.error(err.message); process.exit(1); });
