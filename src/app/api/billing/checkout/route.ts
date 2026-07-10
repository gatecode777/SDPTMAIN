import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import SaaSSubscription from "@/models/SaaSSubscription";
import SaaSTransaction from "@/models/SaaSTransaction";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id || (session.user as any)._id;

    await dbConnect();
    const subscription = await SaaSSubscription.findOne({ userId });

    return NextResponse.json({ subscription });
  } catch (error: any) {
    console.error("Fetch subscription error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id || (session.user as any)._id;

    const body = await req.json();
    const { 
      plan, amount, billingDetails, cardDetails, transactionStatus, failureReason 
    } = body;

    await dbConnect();

    const orderId = `ORD-${Math.floor(100000000 + Math.random() * 900000000)}`;
    const transactionId = `TXN-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const invoiceId = `INV-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    if (transactionStatus !== "success") {
      const failedTx = await SaaSTransaction.create({
        userId,
        plan: plan.toUpperCase(),
        amount,
        currency: "INR",
        orderId,
        transactionId,
        invoiceId,
        status: "failed",
        paymentMethod: "card",
        cardLast4: cardDetails?.number ? cardDetails.number.replace(/\s/g, "").slice(-4) : "0000",
        billingName: billingDetails?.name || "N/A",
        billingAddress: billingDetails?.address || "N/A",
        billingCountry: billingDetails?.country || "N/A",
        billingState: billingDetails?.state || "N/A",
        billingCity: billingDetails?.city || "N/A",
        billingZip: billingDetails?.zip || "N/A",
        invoiceEmail: billingDetails?.email || session.user.email || "N/A",
        gstNumber: billingDetails?.gst || "",
      });
      return NextResponse.json({ 
        success: false, 
        message: failureReason || "Payment transaction failed.",
        orderId,
        transactionId
      });
    }

    // Success transaction: Create successful SaaSTransaction
    const tx = await SaaSTransaction.create({
      userId,
      plan: plan.toUpperCase(),
      amount,
      currency: "INR",
      orderId,
      transactionId,
      invoiceId,
      status: "success",
      paymentMethod: "card",
      cardLast4: cardDetails?.number ? cardDetails.number.replace(/\s/g, "").slice(-4) : "4567",
      billingName: billingDetails?.name || "N/A",
      billingAddress: billingDetails?.address || "N/A",
      billingCountry: billingDetails?.country || "N/A",
      billingState: billingDetails?.state || "N/A",
      billingCity: billingDetails?.city || "N/A",
      billingZip: billingDetails?.zip || "N/A",
      invoiceEmail: billingDetails?.email || session.user.email || "N/A",
      gstNumber: billingDetails?.gst || "",
    });

    // Create or update SaaSSubscription
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month renewal period

    const subscription = await SaaSSubscription.findOneAndUpdate(
      { userId },
      {
        plan: plan.toUpperCase(),
        status: "active",
        amount,
        currency: "INR",
        orderId,
        transactionId,
        invoiceId,
        activationDate: new Date(),
        expiryDate,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ 
      success: true, 
      subscription, 
      transaction: tx 
    });

  } catch (error: any) {
    console.error("Billing checkout error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id || (session.user as any)._id;

    const body = await req.json();
    const { action } = body;

    await dbConnect();

    const sub = await SaaSSubscription.findOne({ userId });
    if (!sub) {
      return NextResponse.json({ message: "No active subscription found" }, { status: 404 });
    }

    if (action === "cancel") {
      sub.status = "cancelled";
      await sub.save();
      return NextResponse.json({ success: true, message: "Subscription cancelled successfully", subscription: sub });
    }

    if (action === "renew") {
      const orderId = `ORD-${Math.floor(100000000 + Math.random() * 900000000)}`;
      const transactionId = `TXN-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const invoiceId = `INV-2026-${Math.floor(100000 + Math.random() * 900000)}`;

      // Generate new transaction log for renewal
      await SaaSTransaction.create({
        userId,
        plan: sub.plan,
        amount: sub.amount,
        currency: sub.currency,
        orderId,
        transactionId,
        invoiceId,
        status: "success",
        paymentMethod: "card",
        cardLast4: "4567",
        billingName: session.user.name || "Subscriber",
        billingAddress: "Billing address on file",
        billingCountry: "IN",
        billingState: "Delhi",
        billingCity: "New Delhi",
        billingZip: "110001",
        invoiceEmail: session.user.email || "subscriber@company.com",
      });

      // Update subscription dates
      const newExpiry = new Date(sub.expiryDate || new Date());
      newExpiry.setMonth(newExpiry.getMonth() + 1);

      sub.status = "active";
      sub.orderId = orderId;
      sub.transactionId = transactionId;
      sub.invoiceId = invoiceId;
      sub.expiryDate = newExpiry;
      await sub.save();

      return NextResponse.json({ success: true, message: "Subscription renewed successfully", subscription: sub });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });

  } catch (error: any) {
    console.error("Subscription update error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
