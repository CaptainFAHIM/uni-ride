"use server"

import mongoose from "mongoose"
import { connectToDatabase } from "../db"

const RideSchema = new mongoose.Schema({
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  startLocation: {
    type: String,
    required: true,
  },
  departureTime: {
    type: Date,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 1,
  },
  fare: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["active", "completed", "cancelled"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    default: "",
  },
})

// Check if the model is already defined to prevent overwriting
export const Ride = mongoose.models.Ride || mongoose.model("Ride", RideSchema)

export async function createRide(rideData: any) {
  await connectToDatabase()
  const ride = new Ride(rideData)
  return ride.save()
}

export async function getRidesByRider(riderId: string) {
  await connectToDatabase()
  return Ride.find({ rider: riderId }).sort({ departureTime: 1 })
}

export async function getRideById(id: string) {
  await connectToDatabase()
  return Ride.findById(id).populate("rider", "name email phone profilePicture")
}

export async function updateRideStatus(id: string, status: string) {
  await connectToDatabase()
  return Ride.findByIdAndUpdate(id, { status }, { new: true })
}

export async function deleteRide(id: string) {
  await connectToDatabase()
  return Ride.findByIdAndDelete(id)
}

export async function searchRides(filters: any) {
  await connectToDatabase()
  const query: any = { status: "active" }

  if (filters.university) {
    query.university = filters.university
  }

  if (filters.startLocation) {
    query.startLocation = { $regex: filters.startLocation, $options: "i" }
  }

  return Ride.find(query).populate("rider", "name email phone profilePicture").sort({ departureTime: 1 })
}

