import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    mobileNumber: { type: String },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "PRODUCT_MANAGER", "ORDER_MANAGER", "CUSTOMER"],
      default: "CUSTOMER",
    },
    isActive: { type: Boolean, default: true },
    cart: [{
      id: { type: String, required: true },
      name: { type: String },
      price: { type: Number },
      qty: { type: Number, default: 1 },
      img: { type: String },
      category: { type: String }
    }],
    wishlist: [{ type: String }], // Array of product IDs
    addresses: [{
      label: { type: String, default: "Home" },
      fullName: { type: String },
      phone: { type: String },
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      isDefault: { type: Boolean, default: false }
    }]
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === "development") {
  // Use a safer check for models in development
  if (mongoose.models && mongoose.models.User) {
    delete mongoose.models.User;
  }
}

const User = models.User || model("User", UserSchema);

export default User;
