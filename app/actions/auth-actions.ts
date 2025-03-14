"use server";

import { redirect } from "next/navigation";
import { createUser, getUserByEmail } from "@/lib/models/user";
import { hashPassword, login, logout } from "@/lib/auth";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const userType = formData.get("userType") as string;
  const university = formData.get("university") as string;

  // Validate inputs
  if (!name || !email || !password || !userType || !university) {
    return { error: "All fields are required" };
  }

  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { error: "Email already registered" };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
      userType,
      university,
      membershipActive: true,
      membershipExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days free trial
    });

    // Log in the new user
    await login(email, password);

    return { success: true, user: newUser.toObject() }; // Convert to plain object
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Failed to register. Please try again." };
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate inputs
  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const user = await login(email, password);
    if (!user) {
      return { error: "Invalid email or password" };
    }

    return { success: true, user };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Failed to login. Please try again." };
  }
}

export async function logoutUser() {
  await logout();
  redirect("/login");
}
