import { Schema, model, models } from "mongoose";

const BannerSchema = new Schema(
  {
    badge: { type: String, default: "Limited Time Offer" },
    title: { type: String, default: "Summer Gaming Upgrade Sale" },
    description: { type: String, default: "Get up to 40% off on all RTX 40-series graphics cards and premium gaming peripherals." },
    buttonText: { type: String, default: "Shop the Sale" },
    buttonLink: { type: String, default: "/shop" },
    imageUrl: { type: String, default: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80" },
    expiryDate: { type: Date, default: () => new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) }, 
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Banner = models.Banner || model("Banner", BannerSchema);

export default Banner;
