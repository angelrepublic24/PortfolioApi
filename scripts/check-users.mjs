import "dotenv/config";
import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;
const User = mongoose.model("User", new mongoose.Schema({}, { strict: false, collection: "users" }));

async function main() {
  await mongoose.connect(DB_URI);
  const users = await User.find({}).select("email name createdAt").lean();
  console.log("user count:", users.length);
  users.forEach((u) => console.log(" -", u.email, "| name:", u.name ?? "(none)"));
  await mongoose.disconnect();
}
main().catch((e) => { console.error(e.message); process.exit(1); });
