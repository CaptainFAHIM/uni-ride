import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/user";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();

    // Check if demo users already exist
    const existingRider = await User.findOne({ email: "rider@example.com" });
    const existingPassenger = await User.findOne({ email: "passenger@example.com" });

    if (existingRider && existingPassenger) {
      return NextResponse.json({
        message: "Demo users already exist",
        riderEmail: "rider@example.com",
        riderPassword: "password123",
        passengerEmail: "passenger@example.com",
        passengerPassword: "password123",
      });
    }

    // Hash passwords before saving
    const hashedPassword = await hashPassword("password123");

    // Create demo rider
    if (!existingRider) {
      const rider = new User({
        name: "Demo Rider",
        email: "rider@example.com",
        password: hashedPassword, // Use awaited hash
        userType: "rider",
        university: "Dhaka University",
        membershipActive: true,
        membershipExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      });
      await rider.save();
    }

    // Create demo passenger
    if (!existingPassenger) {
      const passenger = new User({
        name: "Demo Passenger",
        email: "passenger@example.com",
        password: hashedPassword, // Use awaited hash
        userType: "passenger",
        university: "Dhaka University",
        membershipActive: true,
        membershipExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      });
      await passenger.save();
    }

    return NextResponse.json({
      message: "Demo users created successfully",
      riderEmail: "rider@example.com",
      riderPassword: "password123",
      passengerEmail: "passenger@example.com",
      passengerPassword: "password123",
    });
  } catch (error) {
    console.error("Error seeding demo users:", error);
    return NextResponse.json({ error: "Failed to seed demo users" }, { status: 500 });
  }
}
