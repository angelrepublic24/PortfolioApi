// Replace a project's extra links (website, app stores…). Each link is "Label|URL".
// Prints the old links so the change can be undone.
// Run from the server/ directory:
//   node scripts/set-project-links.mjs "<project name>" "Website|https://…" "Android App|https://play.google.com/…"
import "dotenv/config";
import mongoose from "mongoose";

const [name, ...pairs] = process.argv.slice(2);
if (!name || !pairs.length) {
  console.error('usage: node scripts/set-project-links.mjs "<project name>" "Label|URL" ["Label|URL" …]');
  process.exit(1);
}

const links = pairs.map((p) => {
  const [label, url] = p.split("|").map((s) => s?.trim());
  if (!label || !url) throw new Error(`Bad link "${p}" — expected "Label|URL"`);
  new URL(url); // throws on a malformed URL
  return { label, url };
});

const DB_URI = process.env.DB_URI;
if (!DB_URI) {
  console.error("DB_URI not set (expected in server/.env)");
  process.exit(1);
}

const Project = mongoose.model(
  "Project",
  new mongoose.Schema({}, { strict: false, collection: "projects" })
);

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function main() {
  await mongoose.connect(DB_URI);

  const project = await Project.findOne({ name: new RegExp(`^${escapeRegex(name)}$`, "i") }).lean();
  if (!project) throw new Error(`No project named "${name}"`);
  console.log(`${project.name} old links:`, JSON.stringify(project.links ?? []));

  const res = await Project.updateOne({ _id: project._id }, { $set: { links } });
  console.log(`${project.name} new links:`, JSON.stringify(links), `(modified=${res.modifiedCount})`);

  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
