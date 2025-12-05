import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  image: { type: String, required: true }, // image URL
  eyebrow: { type: String },
  title: { type: String },
  copy: { type: String },
  cta: { type: String },
  align: { type: String, enum: ["left", "right"] }
});

const siteSettingsSchema = new mongoose.Schema({
  site_name: { type: String, required: true },
  sections: { type: [sectionSchema], default: [] },
}, { timestamps: true });

export default mongoose.model("SiteSettings", siteSettingsSchema);
