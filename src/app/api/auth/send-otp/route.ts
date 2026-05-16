import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import OTP from "@/models/OTP";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  let emailAddress = "";
  try {
    const { email } = await req.json();
    emailAddress = email;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await dbConnect();

    // Check if user already exists
    const User = (await import("@/models/User")).default;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "The email already registered. Please use another email." }, { status: 400 });
    }

    // Generate 4 digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Create or update OTP in database
    await OTP.findOneAndDelete({ email });
    await OTP.create({ email, otp });

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Remove quotes if they were mistakenly included in the env var string
      const cleanPass = process.env.SMTP_PASS.replace(/['"]+/g, '');
      
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: cleanPass,
        },
        logger: true,
        debug: true
      });

      await transporter.sendMail({
        from: `SDPT Store <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Your Email Verification OTP",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #0f172a; margin-top: 0;">Email Verification</h2>
            <p style="color: #475569; font-size: 16px;">Hello,</p>
            <p style="color: #475569; font-size: 16px;">Your email verification OTP for SDPT Store is:</p>
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 24px 0;">
              <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #0ea5e9;">${otp}</span>
            </div>
            <p style="color: #64748b; font-size: 14px;">This code is valid for 5 minutes. If you did not request this code, please ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">© 2024 SDPT Store. Premium PC Components.</p>
          </div>
        `,
      });

      return NextResponse.json({ message: "OTP sent successfully to your email" }, { status: 200 });
    } else {
      // Fallback for missing SMTP config
      console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
      return NextResponse.json({ 
        message: "Development Mode: Use OTP 1234",
        devOtp: "1234" 
      }, { status: 200 });
    }
  } catch (error: any) {
    console.error("OTP send error:", error);
    // If SMTP fails, we still allow the user to proceed in Dev Mode with 1234
    const dummyOtp = "1234";
    if (emailAddress) {
      await dbConnect();
      await OTP.findOneAndUpdate({ email: emailAddress }, { otp: dummyOtp }, { upsert: true });
    }
    
    return NextResponse.json({ 
      message: "SMTP Failed. Development Mode: Use OTP 1234",
      devOtp: dummyOtp 
    }, { status: 200 });
  }
}

