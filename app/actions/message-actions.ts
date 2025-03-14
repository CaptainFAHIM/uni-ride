"use server"

import { createMessage, getConversation, getUserConversations, markMessagesAsRead } from "@/lib/models/message"
import { requireAuth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function sendMessage(formData: FormData) {
  const user = await requireAuth()

  const receiverId = formData.get("receiverId") as string
  const rideId = formData.get("rideId") as string
  const content = formData.get("content") as string

  // Validate inputs
  if (!receiverId || !rideId || !content) {
    return { error: "All fields are required" }
  }

  try {
    const newMessage = await createMessage({
      sender: user._id,
      receiver: receiverId,
      ride: rideId,
      content,
    })

    revalidatePath(`/messages/${receiverId}/${rideId}`)
    return { success: true, message: newMessage }
  } catch (error) {
    console.error("Send message error:", error)
    return { error: "Failed to send message" }
  }
}

export async function getMessages(receiverId: string, rideId: string) {
  const user = await requireAuth()

  try {
    const messages = await getConversation(user._id, receiverId, rideId)

    // Mark messages as read
    await markMessagesAsRead(receiverId, user._id, rideId)

    return { success: true, messages }
  } catch (error) {
    console.error("Get messages error:", error)
    return { error: "Failed to get messages" }
  }
}

export async function getConversations() {
  const user = await requireAuth()

  try {
    const conversations = await getUserConversations(user._id)
    return { success: true, conversations }
  } catch (error) {
    console.error("Get conversations error:", error)
    return { error: "Failed to get conversations" }
  }
}

