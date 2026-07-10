import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Website from "@/models/Website";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subdomain = searchParams.get("subdomain");

    if (!subdomain) {
      return NextResponse.json({ message: "Missing subdomain parameter" }, { status: 400 });
    }

    const cleanSubdomain = subdomain.toLowerCase().replace(/\s+/g, "").trim();

    await dbConnect();
    const existing = await Website.findOne({ subdomain: cleanSubdomain });

    if (existing) {
      return NextResponse.json({ exists: true, available: false });
    }

    return NextResponse.json({ exists: false, available: true });
  } catch (error: any) {
    console.error("Subdomain check error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
