import mongoose, { Schema, model, models } from "mongoose";

const ActivityLogSchema = new Schema(
  {
    adminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true },
    adminRole: { type: String, required: true },
    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE", "VIEW", "LOGIN", "LOGOUT", "EXPORT", "OTHER"],
      required: true,
    },
    module: {
      type: String,
      enum: [
        "products",
        "categories",
        "orders",
        "customers",
        "coupons",
        "banner",
        "admins",
        "settings",
        "analytics",
        "queries",
        "auth",
        "other",
      ],
      required: true,
    },
    description: { type: String, required: true },
    targetId: { type: String },
    targetName: { type: String },
    metadata: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

// TTL index: auto-delete logs older than 90 days
ActivityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });
// Index for fast queries by admin and module
ActivityLogSchema.index({ adminId: 1, createdAt: -1 });
ActivityLogSchema.index({ module: 1, createdAt: -1 });
ActivityLogSchema.index({ action: 1, createdAt: -1 });

if (process.env.NODE_ENV === "development") {
  if (mongoose.models && mongoose.models.ActivityLog) {
    delete mongoose.models.ActivityLog;
  }
}

const ActivityLog = models.ActivityLog || model("ActivityLog", ActivityLogSchema);
export default ActivityLog;
