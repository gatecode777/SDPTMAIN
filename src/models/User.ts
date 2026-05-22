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
      enum: ["SUPER_ADMIN", "ADMIN", "SUB_ADMIN", "PRODUCT_MANAGER", "ORDER_MANAGER", "CUSTOMER"],
      default: "CUSTOMER",
    },
    isActive: { type: Boolean, default: true },
    permissions: {
      dashboard: {
        view: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
      },
      users: {
        view: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
      },
      products: {
        view: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
      },
      categories: {
        view: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
      },
      orders: {
        view: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
      },
      coupons: {
        view: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
      },
      blogs: {
        view: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
      },
      blogCategories: {
        view: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
      },
    },
    cart: [{
      id: { type: String, required: true },
      name: { type: String },
      price: { type: Number },
      qty: { type: Number, default: 1 },
      img: { type: String },
      category: { type: String }
    }],
    wishlist: [{ type: String }], 
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
  
  if (mongoose.models && mongoose.models.User) {
    delete mongoose.models.User;
  }
}

const User = models.User || model("User", UserSchema);

export default User;
