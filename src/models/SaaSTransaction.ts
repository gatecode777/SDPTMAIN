import mongoose, { Schema, model, models } from "mongoose";

const SaaSTransactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    orderId: { type: String, required: true, unique: true },
    transactionId: { type: String, required: true, unique: true },
    invoiceId: { type: String, required: true, unique: true },
    status: { type: String, default: "success" },
    paymentMethod: { type: String, default: "card" },
    cardLast4: { type: String },
    billingName: { type: String, required: true },
    billingAddress: { type: String, required: true },
    billingCountry: { type: String, required: true },
    billingState: { type: String, required: true },
    billingCity: { type: String, required: true },
    billingZip: { type: String, required: true },
    invoiceEmail: { type: String, required: true },
    gstNumber: { type: String },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development") {
  if (mongoose.models && mongoose.models.SaaSTransaction) {
    delete mongoose.models.SaaSTransaction;
  }
}

const SaaSTransaction = models.SaaSTransaction || model("SaaSTransaction", SaaSTransactionSchema);
export default SaaSTransaction;
