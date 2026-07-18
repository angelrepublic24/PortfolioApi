import { model, Schema } from "mongoose";

/**
 * Singleton document holding the site-level narrative (hero, bio, notes,
 * section-cut floors, contact) so that NOTHING on the public page is hardcoded —
 * everything is editable from the admin panel, just like projects & experience.
 */

const floorSchema = new Schema(
  { label: String, techTop: String, techBottom: String },
  { _id: false }
);

const heroSchema = new Schema(
  { eyebrow: String, headLead: String, headAmber: String, spec: [String], lede: String },
  { _id: false }
);

const contactSchema = new Schema(
  {
    github: String, githubLabel: String,
    linkedin: String, linkedinLabel: String,
    email: String,
    studio: String, studioLabel: String,
  },
  { _id: false }
);

const siteContentSchema = new Schema(
  {
    singleton: { type: String, default: "site", unique: true },
    brand: String,
    name: String,
    role: String,
    location: String,
    rev: String,
    hero: heroSchema,
    coverDisciplines: [String],
    notes: [String],
    sectionFloors: [floorSchema],
    contact: contactSchema,
    sealText: String,
  },
  { timestamps: true }
);

const SiteContent = model("SiteContent", siteContentSchema);
export default SiteContent;
