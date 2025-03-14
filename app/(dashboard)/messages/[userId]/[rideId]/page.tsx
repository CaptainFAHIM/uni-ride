"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { getMessages, sendMessage } from "@/app/actions/message-actions"
import { getRideById } from "@/app/actions/ride-actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: {
    userId: string
    rideId: string
  }
}

export default function ConversationPage({ params }: PageProps) {
  const { userId, rideId } = params
  const router = useRouter()
  const [messages, setMessages] = useState<any[]>([])
  const [ride, setRide] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadData() {
      try {
        // Get ride details
        const rideResult = await getRideById(rideId)

        if (rideResult.error) {
          toast({
            title: "Failed to Load Ride",
            description: rideResult.error,
            variant: "destructive",
          })
          router.push("/messages")
          return
        }

        setRide(rideResult.ride)

        // Get messages
        const messagesResult = await getMessages(userId, rideId)

        if (messagesResult.error) {
          toast({
            title: "Failed to Load Messages",
            description: messagesResult.error,
            variant: "destructive",
          })
        } else {
          setMessages(messagesResult.messages)
        }
      } catch (error) {
        toast({
          title: "Failed to Load Data",
          description: "An unexpected error occurred.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    // Poll for new messages every 10 seconds
    const interval = setInterval(async () => {
      try {
        const result = await getMessages(userId, rideId)
        if (!result.error && result.messages) {
          setMessages(result.messages)
        }
      } catch (error) {
        console.error("Error polling messages:", error)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [userId, rideId, router])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSendMessage(formData: FormData) {
    setIsSending(true)

    try {
      formData.append("receiverId", userId)
      formData.append("rideId", rideId)

      const result = await sendMessage(formData)

      if (result.error) {
        toast({
          title: "Failed to Send Message",
          description: result.error,
          variant: "destructive",
        })
      } else {
        // Refresh messages
        const messagesResult = await getMessages(userId, rideId)
        if (!messagesResult.error) {
          setMessages(messagesResult.messages)
        }

        // Clear the form
        const form = document.getElementById("message-form") as HTMLFormElement
        form.reset()
      }
    } catch (error) {
      toast({
        title: "Failed to Send Message",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <Link href="/messages">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Conversation</h1>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-muted-foreground">Loading conversation...</p>
        </div>
      ) : (
        <>
          {ride && (
            <Card>
              <CardHeader>
                <CardTitle>Ride Details</CardTitle>
                <CardDescription>Information about the ride you&apos;re discussing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">University</p>
                    <p className="text-sm text-muted-foreground">{ride.university}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Starting Location</p>
                    <p className="text-sm text-muted-foreground">{ride.startLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Departure Time</p>
                    <p className="text-sm text-muted-foreground">{new Date(ride.departureTime).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Fare</p>
                    <p className="text-sm text-muted-foreground">{ride.fare} BDT</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Available Seats</p>
                    <p className="text-sm text-muted-foreground">{ride.availableSeats}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-sm text-muted-foreground capitalize">{ride.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="flex flex-col h-[600px]">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Your conversation with {ride?.rider.name}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No messages yet. Start the conversation!</div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isCurrentUser = message.sender._id !== userId

                    return (
                      <div key={message._id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`flex items-start max-w-[80%] ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}
                        >
                          <Avatar className={`${isCurrentUser ? "ml-2" : "mr-2"}`}>
                            <AvatarImage src="" alt={isCurrentUser ? "You" : message.sender.name} />
                            <AvatarFallback>{isCurrentUser ? "You" : message.sender.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div
                              className={`rounded-lg p-3 ${
                                isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              <p>{message.content}</p>
                            </div>
                            <p
                              className={`text-xs text-muted-foreground mt-1 ${
                                isCurrentUser ? "text-right" : "text-left"
                              }`}
                            >
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <form id="message-form" action={handleSendMessage} className="w-full flex space-x-2">
                <Textarea
                  name="content"
                  placeholder="Type your message..."
                  className="flex-grow resize-none"
                  required
                />
                <Button type="submit" disabled={isSending}>
                  {isSending ? "Sending..." : "Send"}
                </Button>
              </form>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  )
}

