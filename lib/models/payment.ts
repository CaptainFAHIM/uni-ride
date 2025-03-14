"use server"

import mongoose from "mongoose"
import { connectToDatabase } from "../db"

const PaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  membershipType: {
    type: String,
    enum: ["rider", "passenger"],
    required: true,
  },
  membershipStartDate: {
    type: Date,
    default: Date.now,
  },
  membershipEndDate: {
    type: Date,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
})

// Check if the model is already defined to prevent overwriting
export const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema)

export async function createPayment(paymentData: any) {
  await connectToDatabase()
  const payment = new Payment(paymentData)
  return payment.save()
}

export async function getPaymentsByUser(userId: string) {
  await connectToDatabase()
  return Payment.find({ user: userId }).sort({ paymentDate: -1 })
}

export async function getLatestPayment(userId: string) {
  await connectToDatabase()
  return Payment.findOne({ user: userId }).sort({ paymentDate: -1 })
}

