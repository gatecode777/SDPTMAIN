import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        variant: { type: String },
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
      fullName: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      phone: String,
    },
    paymentMethod: { type: String, required: true }, 
    paymentStatus: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED", "CANCELLED"],
      default: "PENDING",
    },
    paymentDetails: {
      transactionId: String,
      upiId: String,
      cardLast4: String,
      paymentTimestamp: Date,
    },
    orderStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED", "RETURN_REQUESTED", "REFUNDED"],
      default: "PENDING",
    },
    returnDetails: {
      isReturnRequested: { type: Boolean, default: false },
      reason: String,
      requestDate: Date,
      status: {
        type: String,
        enum: ["NONE", "PENDING", "APPROVED", "REJECTED", "COMPLETED"],
        default: "NONE",
      },
      refundAmount: Number,
      returnDeadline: Date, 
    },
    refundDetails: {
      refundMethod: { type: String, enum: ["ORIGINAL", "UPI", "NONE"], default: "NONE" },
      upiId: String,
      refundStatus: { type: String, enum: ["PENDING", "COMPLETED", "NONE"], default: "NONE" },
    },
    trackingNumber: { type: String },
    deliveryDate: { type: Date },
    invoiceUrl: { type: String },
    history: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        comment: String,
      },
    ],
  },
  { timestamps: true }
);

OrderSchema.index({ customer: 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1, createdAt: -1 });

const Order = models.Order || model("Order", OrderSchema);

export default Order;
