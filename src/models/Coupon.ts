import { Schema, model, models } from "mongoose";

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: ["PERCENTAGE", "FIXED"], required: true },
    value: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 0 }, 
    usedCount: { type: Number, default: 0 },
    minCartValue: { type: Number, default: 0 },
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CouponSchema.index({ isActive: 1, expiryDate: 1 });
CouponSchema.index({ createdAt: -1 });

const Coupon = models.Coupon || model("Coupon", CouponSchema);

export default Coupon;
