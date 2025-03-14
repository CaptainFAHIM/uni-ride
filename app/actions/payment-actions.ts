"use server"

import { createPayment, getPaymentsByUser } from "@/lib/models/payment"
import { requireAuth } from "@/lib/auth"
import { updateUser } from "@/lib/models/user"
import { revalidatePath } from "next/cache"

export async function processPayment(formData: FormData) {
  const user = await requireAuth()

  const cardNumber = formData.get("cardNumber") as string
  const expiryDate = formData.get("expiryDate") as string
  const cvv = formData.get("cvv") as string

  // Validate inputs
  if (!cardNumber || !expiryDate || !cvv) {
    return { error: "All payment fields are required" }
  }

  try {
    // Calculate membership fee based on user type
    const amount = user.userType === "rider" ? 70 : 50

    // Calculate membership end date (30 days from now)
    const membershipEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    // Create payment record
    const payment = await createPayment({
      user: user._id,
      amount,
      membershipType: user.userType,
      membershipEndDate,
      transactionId: `TR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    })

    // Update user's membership status
    await updateUser(user._id, {
      membershipActive: true,
      membershipExpiry: membershipEndDate,
    })

    revalidatePath("/membership")
    return { success: true, payment }
  } catch (error) {
    console.error("Payment error:", error)
    return { error: "Failed to process payment" }
  }
}

export async function getPaymentHistory() {
  const user = await requireAuth()

  try {
    const payments = await getPaymentsByUser(user._id)
    return { success: true, payments }
  } catch (error) {
    console.error("Get payments error:", error)
    return { error: "Failed to get payment history" }
  }
}

