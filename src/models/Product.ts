import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    sku: { type: String, required: true, unique: true },
    images: [{ type: String }],
    thumbnail: { type: String },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    offerPrice: { type: Number, required: true },
    stockQuantity: { type: Number, required: true, default: 0 },
    lowStockAlert: { type: Number, default: 10 },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED"],
      default: "PUBLISHED",
    },
    isFeatured: { type: Boolean, default: false },
    isOnOffer: { type: Boolean, default: false },
    offerDescription: { type: String },
    warrantyDuration: { type: Number, default: 0 },
    averageRating: { type: Number, default: 5 },
    totalReviews: { type: Number, default: 0 },
    ratings: [
      {
        userId: { type: String },
        rating: { type: Number, required: true },
        review: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

ProductSchema.index({ status: 1, createdAt: -1 });
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ offerPrice: 1, status: 1 });
ProductSchema.index({ isFeatured: 1, status: 1 });
ProductSchema.index({ isOnOffer: 1, status: 1 });

ProductSchema.pre("validate", function () {
  if (this.mrp && this.discountPercentage !== undefined) {
    const calculatedPrice = this.mrp - (this.mrp * this.discountPercentage) / 100;
    this.offerPrice = calculatedPrice;
    this.price = calculatedPrice; 
  }
});

const Product = models.Product || model("Product", ProductSchema);

export default Product;
