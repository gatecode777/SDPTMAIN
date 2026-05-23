import { Schema, model, models } from "mongoose";

const QuerySchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      default: "PENDING",
    },
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

QuerySchema.index({ status: 1, createdAt: -1 });
QuerySchema.index({ createdAt: -1 });

const Query = models.Query || model("Query", QuerySchema);

export default Query;
