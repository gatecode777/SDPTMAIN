import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      return NextResponse.json({ message: "Name should only contain letters and spaces" }, { status: 400 });
    }

    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      return NextResponse.json({ message: "Phone number must be exactly 10 digits" }, { status: 400 });
    }

    await dbConnect();

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 400 }
      );
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      mobileNumber: phone,
      role: "CUSTOMER", 
    });

    return NextResponse.json(
      { message: "User created successfully", user: { id: newUser._id, name, email, mobileNumber: phone } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
