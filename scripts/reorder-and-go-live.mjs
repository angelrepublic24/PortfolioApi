// One-off (Oct 2026): hide Precision OPS, move Cibaura up to the third home sheet,
// and mark the three marketplaces live — matching the 2026 resume ("3 live products").
// Run from the server/ directory:  node scripts/reorder-and-go-live.mjs
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

// Featured sheets on the home, top to bottom.
const HOME_ORDER = [/^beusun$/i, /^offload$/i, /^cibaura$/i, /^tudelu$/i, /^selia$/i];
const GO_LIVE = [/^offload$/i, /^beusun$/i, /^cibaura$/i];

function report(label, res) {
  const warn = res.matchedCount === 1 ? "" : "   <-- expected exactly one match";
  console.log(`${label}: matched=${res.matchedCount} modified=${res.modifiedCount}${warn}`);
}

async function main() {
  await mongoose.connect(DB_URI);
  console.log("connected");

  // 1. Precision OPS off the public site (same flag the admin's eye toggle sets).
  report("Precision OPS hidden", await Project.updateOne({ name: /^precision ops$/i }, { $set: { hidden: true } }));

  // 2. Home order
  for (const [order, match] of HOME_ORDER.entries()) {
    report(`order ${order} ${match}`, await Project.updateOne({ name: match }, { $set: { order } }));
  }

  // 3. Live status
  for (const match of GO_LIVE) {
    report(`live ${match}`, await Project.updateOne({ name: match }, { $set: { status: "live" } }));
  }

  const sheets = await Project.find({ featured: true, hidden: { $ne: true } })
    .select("name order status")
    .sort("order")
    .lean();
  console.log("\nhome sheets now:");
  for (const s of sheets) console.log(`  ${s.order}: ${s.name} (${s.status})`);

  await mongoose.disconnect();
  console.log("done");
}

main().catch((e) => { console.error(e); process.exit(1); });
