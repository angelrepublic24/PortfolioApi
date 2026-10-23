// Upload a local image to Cloudinary (same folder/options as the admin upload) and make it
// a project's logo (`image`). Prints the old URL so the change can be undone.
// Run from the server/ directory:
//   node scripts/set-project-logo.mjs "<project name>" <image file>
import "dotenv/config";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

const [name, file] = process.argv.slice(2);
if (!name || !file) {
  console.error('usage: node scripts/set-project-logo.mjs "<project name>" <image file>');
  process.exit(1);
}

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

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function main() {
  await mongoose.connect(DB_URI);

  const project = await Project.findOne({ name: new RegExp(`^${escapeRegex(name)}$`, "i") }).lean();
  if (!project) throw new Error(`No project named "${name}"`);
  console.log(`${project.name} old logo:`, project.image ?? "(none)");

  const uploaded = await cloudinary.uploader.upload(file, {
    folder: "Portfolio",
    use_filename: true,
    unique_filename: true,
  });
  const res = await Project.updateOne({ _id: project._id }, { $set: { image: uploaded.secure_url } });
  console.log(`${project.name} new logo:`, uploaded.secure_url, `(modified=${res.modifiedCount})`);

  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
