import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import OTP from "@/models/OTP";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
    }

    await dbConnect();

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return NextResponse.json({ message: "OTP has expired or is invalid" }, { status: 400 });
    }

    if (otpRecord.otp !== otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    
    await OTP.findOneAndDelete({ email });

    return NextResponse.json({ message: "OTP verified successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("OTP verification error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
