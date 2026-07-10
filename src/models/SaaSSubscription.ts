import mongoose, { Schema, model, models } from "mongoose";

const SaaSSubscriptionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, enum: ["FREE", "PRO", "BUSINESS"], default: "FREE" },
    status: { type: String, enum: ["active", "cancelled", "expired"], default: "active" },
    amount: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    orderId: { type: String },
    transactionId: { type: String },
    invoiceId: { type: String },
    activationDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development") {
  if (mongoose.models && mongoose.models.SaaSSubscription) {
    delete mongoose.models.SaaSSubscription;
  }
}

const SaaSSubscription = models.SaaSSubscription || model("SaaSSubscription", SaaSSubscriptionSchema);
export default SaaSSubscription;
