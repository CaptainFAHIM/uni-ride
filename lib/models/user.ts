"use server"

import mongoose from "mongoose"
import { connectToDatabase } from "../db"

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["rider", "passenger"],
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  membershipActive: {
    type: Boolean,
    default: true, // Free for first week
  },
  membershipExpiry: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
  profilePicture: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
})

// Check if the model is already defined to prevent overwriting
export const User = mongoose.models.User || mongoose.model("User", UserSchema)

export async function createUser(userData: any) {
  await connectToDatabase()
  const user = new User(userData)
  return user.save()
}

export async function getUserByEmail(email: string) {
  await connectToDatabase()
  return User.findOne({ email })
}

export async function getUserById(id: string) {
  await connectToDatabase()
  return User.findById(id)
}

export async function updateUser(id: string, userData: any) {
  await connectToDatabase()
  return User.findByIdAndUpdate(id, userData, { new: true })
}

