"use server";

import { cookies } from "next/headers";
import { createHash } from "crypto";
import { getUserByEmail, getUserById } from "./models/user";
import { redirect } from "next/navigation";

// Helper function to properly serialize Mongoose documents
function serializeMongoose(doc: any) {
  if (!doc) return null;
  // Handle arrays
  if (Array.isArray(doc)) {
    return JSON.parse(JSON.stringify(doc));
  }
  // Handle single documents
  return JSON.parse(JSON.stringify(doc.toObject ? doc.toObject() : doc));
}

// Hash password function
export async function hashPassword(password: string): Promise<string> {
  return createHash("sha256").update(password).digest("hex");
}

// Generate a session token
export async function generateSessionToken(): Promise<string> {
  return createHash("sha256").update(Math.random().toString()).digest("hex");
}

// Set session cookie
export async function setSessionCookie(userId: string) {
  const token = await generateSessionToken();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiry

  const cookieStore = await cookies(); // Ensure cookies() is awaited
  await cookieStore.set("session", `${userId}:${token}`, {
    expires,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return token;
}

// Clear session cookie
export async function clearSessionCookie() {
  const cookieStore = await cookies(); // Ensure cookies() is awaited
  await cookieStore.delete("session");
}

// Get current user from session
export async function getCurrentUser() {
  const cookieStore = await cookies(); // Ensure cookies() is awaited
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie?.value) return null;

  const [userId] = sessionCookie.value.split(":");

  if (!userId) return null;

  try {
    const user = await getUserById(userId);
    // Properly serialize the Mongoose document
    return serializeMongoose(user);
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

// Check if user is authenticated
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

// Check if membership is active
export async function checkMembership(user: any) {
  if (!user) return false;
  return new Date() < new Date(user.membershipExpiry);
}

// Login function
export async function login(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user || user.password !== (await hashPassword(password))) return null;

  await setSessionCookie(user._id.toString());
  // Properly serialize the Mongoose document
  return serializeMongoose(user);
}

// Logout function
export async function logout() {
  await clearSessionCookie();
}