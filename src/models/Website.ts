import mongoose, { Schema, model, models } from "mongoose";

const WebsiteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subdomain: { type: String, required: true, unique: true, lowercase: true, trim: true },
    businessName: { type: String, required: true },
    businessCategory: { type: String, required: true },
    businessDescription: { type: String, required: true },
    contactEmail: { type: String },
    contactPhone: { type: String },
    whatsappNumber: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    googleMapsLink: { type: String },
    logoUrl: { type: String },
    coverUrl: { type: String },
    businessHours: { type: String },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
      twitter: { type: String },
      youtube: { type: String },
    },
    websiteType: { type: String, default: "Business Website" },
    websiteGoal: { type: String, default: "Generate Leads" },
    websiteTone: { type: String, default: "Professional" },
    themeColors: {
      primary: { type: String, default: "#102E63" },
      secondary: { type: String, default: "#00B4D8" },
      accent: { type: String, default: "#00B4D8" },
    },
    fontStyle: { type: String, default: "Modern" },
    pages: [{ type: String }],
    homeSections: [{ type: String }],
    heroHeading: { type: String },
    heroSubheading: { type: String },
    ctaText: { type: String },
    contactFormRequired: { type: Boolean, default: true },
    whatsappButtonRequired: { type: Boolean, default: true },
    stickyHeader: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: false },
    animations: { type: String, default: "Premium" },
    generatedContent: { type: Schema.Types.Mixed },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development") {
  if (mongoose.models && mongoose.models.Website) {
    delete mongoose.models.Website;
  }
}

const Website = models.Website || model("Website", WebsiteSchema);
export default Website;
