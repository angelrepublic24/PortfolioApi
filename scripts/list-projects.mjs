// Read-only: list every project with its Drawing Set metadata.
import "dotenv/config";
import mongoose from "mongoose";

const Project = mongoose.model(
  "Project",
  new mongoose.Schema({}, { strict: false, collection: "projects" })
);

await mongoose.connect(process.env.DB_URI);
const all = await Project.find({}).sort("order").lean();
console.log("total:", all.length);
for (const p of all) {
  console.log(
    JSON.stringify({
      _id: String(p._id),
      name: p.name,
      order: p.order,
      featured: p.featured,
      hidden: p.hidden,
      status: p.status,
      kind: p.kind,
      client: p.client,
      role: p.role,
      date: p.date,
      url: p.url,
      image: p.image,
      disciplines: p.disciplines,
      lang: p.lang,
      summary: p.summary,
    })
  );
}
await mongoose.disconnect();
