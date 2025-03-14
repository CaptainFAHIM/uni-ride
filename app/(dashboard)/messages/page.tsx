"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getConversations } from "@/app/actions/message-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function MessagesPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadConversations() {
      try {
        const result = await getConversations()

        if (result.error) {
          toast({
            title: "Failed to Load Messages",
            description: result.error,
            variant: "destructive",
          })
        } else {
          setConversations(result.conversations)
        }
      } catch (error) {
        toast({
          title: "Failed to Load Messages",
          description: "An unexpected error occurred.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadConversations()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Communicate with riders and passengers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Conversations</CardTitle>
          <CardDescription>Recent messages with other users</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-muted-foreground">Loading conversations...</p>
            </div>
          ) : conversations && conversations.length > 0 ? (
            <div className="space-y-4">
              {conversations.map((conversation) => (
                <Link
                  key={`${conversation.user._id}-${conversation.ride._id}`}
                  href={`/messages/${conversation.user._id}/${conversation.ride._id}`}
                >
                  <div
                    className={`p-4 rounded-lg border ${conversation.unread ? "bg-primary/5 border-primary/20" : "hover:bg-muted/50"}`}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={conversation.user.profilePicture || ""} alt={conversation.user.name} />
                        <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{conversation.user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(conversation.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{conversation.lastMessage}</p>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Ride:</span> {conversation.ride.university} from{" "}
                          {conversation.ride.startLocation}
                        </div>
                        {conversation.unread && (
                          <div className="mt-1">
                            <span className="px-2 py-1 text-xs rounded-full bg-primary text-primary-foreground">
                              New message
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              You don&apos;t have any conversations yet.
              {conversations && conversations.length === 0 && (
                <p className="mt-2">
                  <Link href="/rides" className="text-primary hover:underline">
                    Find rides
                  </Link>{" "}
                  to start a conversation with a rider.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

