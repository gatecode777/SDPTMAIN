import mongoose, { Schema, model, models } from "mongoose";

const OTPSchema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 } 
  }
);

OTPSchema.index({ email: 1 });

if (process.env.NODE_ENV === "development") {
  if (mongoose.models && mongoose.models.OTP) {
    delete mongoose.models.OTP;
  }
}

const OTP = models.OTP || model("OTP", OTPSchema);

export default OTP;
