import "dotenv/config";
import mongoose from "mongoose";

const Project = mongoose.model("Project", new mongoose.Schema({}, { strict: false, collection: "projects" }));
const Experience = mongoose.model("Experience", new mongoose.Schema({}, { strict: false, collection: "experiences" }));

const ROLE = "Lead Software Engineer & System Architect";

async function main() {
  await mongoose.connect(process.env.DB_URI);
  const p = await Project.updateOne({ name: /^tudelu$/i }, { $set: { role: ROLE } });
  console.log("project Tudelu role:", p.matchedCount, p.modifiedCount);
  const e = await Experience.updateOne({ company: /^tudelu$/i }, { $set: { position: ROLE } });
  console.log("experience Tudelu position:", e.matchedCount, e.modifiedCount);
  await mongoose.disconnect();
}
main().catch((err) => { console.error(err.message); process.exit(1); });
