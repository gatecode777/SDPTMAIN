import { Schema, model, models } from "mongoose";

const SettingsSchema = new Schema(
  {
    storeName: { type: String, default: "My Store" },
    storeEmail: { type: String },
    storePhone: { type: String },
    address: { type: String },
    currency: { type: String, default: "USD" },
    taxPercentage: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    logo: { type: String },
    favicon: { type: String },
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
    },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Settings = models.Settings || model("Settings", SettingsSchema);

export default Settings;
