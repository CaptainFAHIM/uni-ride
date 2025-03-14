"use server"

import mongoose from "mongoose"
import { connectToDatabase } from "../db"

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ride",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
})

// Check if the model is already defined to prevent overwriting
export const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema)

export async function createMessage(messageData: any) {
  await connectToDatabase()
  const message = new Message(messageData)
  return message.save()
}

export async function getConversation(userId1: string, userId2: string, rideId: string) {
  await connectToDatabase()
  return Message.find({
    $or: [
      { sender: userId1, receiver: userId2, ride: rideId },
      { sender: userId2, receiver: userId1, ride: rideId },
    ],
  }).sort({ timestamp: 1 })
}

export async function getUserConversations(userId: string) {
  await connectToDatabase()
  const sentMessages = await Message.find({ sender: userId })
    .populate("receiver", "name profilePicture")
    .populate("ride", "university startLocation")
    .sort({ timestamp: -1 })

  const receivedMessages = await Message.find({ receiver: userId })
    .populate("sender", "name profilePicture")
    .populate("ride", "university startLocation")
    .sort({ timestamp: -1 })

  // Combine and get unique conversations
  const conversations = new Map()

  for (const msg of [...sentMessages, ...receivedMessages]) {
    const otherUser = msg.sender._id.toString() === userId ? msg.receiver : msg.sender

    const key = `${otherUser._id}-${msg.ride._id}`

    if (!conversations.has(key) || conversations.get(key).timestamp < msg.timestamp) {
      conversations.set(key, {
        user: otherUser,
        ride: msg.ride,
        lastMessage: msg.content,
        timestamp: msg.timestamp,
        unread: msg.receiver._id.toString() === userId && !msg.read,
      })
    }
  }

  return Array.from(conversations.values()).sort((a, b) => b.timestamp - a.timestamp)
}

export async function markMessagesAsRead(senderId: string, receiverId: string, rideId: string) {
  await connectToDatabase()
  return Message.updateMany({ sender: senderId, receiver: receiverId, ride: rideId, read: false }, { read: true })
}

