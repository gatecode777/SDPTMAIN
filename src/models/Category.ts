import mongoose, { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    isVisible: { type: Boolean, default: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Category = models.Category || model("Category", CategorySchema);

export default Category;
