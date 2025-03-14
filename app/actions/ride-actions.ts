'use server'

import { createRide, getRidesByRider, getRideById, updateRideStatus, deleteRide, searchRides } from "@/lib/models/ride"
import { getCurrentUser, requireAuth, checkMembership } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function addRide(formData: FormData) {
  const user = await requireAuth()

  // Check if user is a rider
  if (user.userType !== "rider") {
    return { error: "Only riders can add rides" }
  }

  // Check if membership is active
  const isMembershipActive = await checkMembership(user)
  if (!isMembershipActive) {
    return { error: "Your membership has expired. Please renew to add rides." }
  }

  const university = formData.get("university") as string
  const startLocation = formData.get("startLocation") as string
  const departureTime = formData.get("departureTime") as string
  const availableSeats = Number.parseInt(formData.get("availableSeats") as string)
  const fare = Number.parseInt(formData.get("fare") as string)
  const description = formData.get("description") as string

  // Validate inputs
  if (!university || !startLocation || !departureTime || !availableSeats || isNaN(fare)) {
    return { error: "All fields are required" }
  }

  try {
    const newRide = await createRide({
      rider: user._id,
      university,
      startLocation,
      departureTime: new Date(departureTime),
      availableSeats,
      fare,
      description,
      status: "active",
    })

    revalidatePath("/dashboard")
    return { success: true, ride: newRide }
  } catch (error) {
    console.error("Add ride error:", error)
    return { error: "Failed to add ride. Please try again." }
  }
}

export async function getUserRides() {
  const user = await requireAuth()

  try {
    const rides = await getRidesByRider(user._id)
    return { success: true, rides }
  } catch (error) {
    console.error("Get rides error:", error)
    return { error: "Failed to get rides" }
  }
}

export async function completeRide(id: string) {
  const user = await requireAuth()

  try {
    const ride = await getRideById(id)

    if (!ride) {
      return { error: "Ride not found" }
    }

    if (ride.rider.toString() !== user._id.toString()) {
      return { error: "Not authorized" }
    }

    const updatedRide = await updateRideStatus(id, "completed")
    revalidatePath("/dashboard")
    return { success: true, ride: updatedRide }
  } catch (error) {
    console.error("Complete ride error:", error)
    return { error: "Failed to complete ride" }
  }
}

export async function removeRide(id: string) {
  const user = await requireAuth()

  try {
    const ride = await getRideById(id)

    if (!ride) {
      return { error: "Ride not found" }
    }

    if (ride.rider.toString() !== user._id.toString()) {
      return { error: "Not authorized" }
    }

    await deleteRide(id)
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Delete ride error:", error)
    return { error: "Failed to delete ride" }
  }
}

export async function searchAvailableRides(formData: FormData) {
  const user = await getCurrentUser()

  // Check if membership is active for logged-in users
  if (user) {
    const isMembershipActive = await checkMembership(user)
    if (!isMembershipActive) {
      return { error: "Your membership has expired. Please renew to search rides." }
    }
  }

  const university = formData.get("university") as string
  const startLocation = formData.get("startLocation") as string

  try {
    const rides = await searchRides({ university, startLocation })
    return { success: true, rides }
  } catch (error) {
    console.error("Search rides error:", error)
    return { error: "Failed to search rides" }
  }
}

export async function getRideDetails(id: string) {
  try {
    const ride = await getRideById(id)
    return { success: true, ride }
  } catch (error) {
    console.error("Get ride error:", error)
    return { error: "Failed to get ride" }
  }
}

