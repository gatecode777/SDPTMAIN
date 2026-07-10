import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
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
    const transactions = await SaaSTransaction.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ transactions });
  } catch (error: any) {
    console.error("Fetch billing history error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
