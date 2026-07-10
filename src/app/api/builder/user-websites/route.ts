import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Website from "@/models/Website";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id || (session.user as any)._id;

    await dbConnect();
    const websites = await Website.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ websites });
  } catch (error: any) {
    console.error("Fetch user websites error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id || (session.user as any)._id;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Missing website ID" }, { status: 400 });
    }

    await dbConnect();
    const deleted = await Website.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return NextResponse.json({ message: "Website not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Website deleted successfully" });
  } catch (error: any) {
    console.error("Delete website error:", error);
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
    const { id, subdomain } = body;

    if (!id || !subdomain) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const cleanSubdomain = subdomain.toLowerCase().replace(/\s+/g, "").trim();

    await dbConnect();
    
    const existing = await Website.findOne({ subdomain: cleanSubdomain, _id: { $ne: id } });
    if (existing) {
      return NextResponse.json({ message: "Subdomain is already taken" }, { status: 400 });
    }

    const updated = await Website.findOneAndUpdate(
      { _id: id, userId },
      { subdomain: cleanSubdomain },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: "Website not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Subdomain changed successfully", website: updated });
  } catch (error: any) {
    console.error("Update website error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
