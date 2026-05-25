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

    
    const User = (await import("@/models/User")).default;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "The email already registered. Please use another email." }, { status: 400 });
    }

    
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    
    await OTP.findOneAndDelete({ email });
    await OTP.create({ email, otp });

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      
      const cleanPass = process.env.SMTP_PASS.replace(/['"]+/g, '');
      
      console.log("[DEBUG] Vercel is currently using SMTP_HOST:", process.env.SMTP_HOST);
      
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
        port: parseInt(process.env.SMTP_PORT || "2525"),
        auth: {
          user: process.env.SMTP_USER,
          pass: cleanPass,
        },
        logger: process.env.NODE_ENV === "development",
        debug: process.env.NODE_ENV === "development"
      });

      await transporter.sendMail({
        from: `SDPT Store <${process.env.SMTP_FROM_EMAIL || "noreply@sdpttech.com"}>`,
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
      if (process.env.NODE_ENV === "development") {
        const devOtp = "1234";
        await OTP.findOneAndDelete({ email });
        await OTP.create({ email, otp: devOtp });
        console.log(`[DEV MODE] OTP for ${email}: ${devOtp}`);
        return NextResponse.json({ 
          message: "Development Mode: Use OTP 1234",
          devOtp 
        }, { status: 200 });
      } else {
        return NextResponse.json({ message: "SMTP configuration is missing." }, { status: 500 });
      }
    }
  } catch (error: any) {
    console.error("OTP send error:", error);
    
    if (process.env.NODE_ENV === "development") {
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
    
    return NextResponse.json({ 
      message: "Failed to send OTP email. Please try again later."
    }, { status: 500 });
  }
}

