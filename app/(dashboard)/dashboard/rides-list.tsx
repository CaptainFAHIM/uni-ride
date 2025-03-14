"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { completeRide, removeRide } from "@/app/actions/ride-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface RidesListProps {
  rides: any[]
  userType: string
  emptyMessage: string
}

export function RidesList({ rides, userType, emptyMessage }: RidesListProps) {
  const router = useRouter()
  const [processingRideId, setProcessingRideId] = useState<string | null>(null)

  async function handleCompleteRide(id: string) {
    setProcessingRideId(id)

    try {
      const result = await completeRide(id)

      if (result.error) {
        toast({
          title: "Failed to Complete Ride",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Ride Completed",
          description: "The ride has been marked as completed.",
        })
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Failed to Complete Ride",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setProcessingRideId(null)
    }
  }

  async function handleDeleteRide(id: string) {
    setProcessingRideId(id)

    try {
      const result = await removeRide(id)

      if (result.error) {
        toast({
          title: "Failed to Delete Ride",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Ride Deleted",
          description: "The ride has been deleted successfully.",
        })
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Failed to Delete Ride",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setProcessingRideId(null)
    }
  }

  if (rides.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">{emptyMessage}</div>
  }

  return (
    <div className="space-y-4 mt-4">
      {rides.map((ride) => (
        <Card key={ride._id}>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">University:</span>
                  <span>{ride.university}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">From:</span>
                  <span>{ride.startLocation}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">Departure:</span>
                  <span>{new Date(ride.departureTime).toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">Seats:</span>
                  <span>{ride.availableSeats}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">Fare:</span>
                  <span>{ride.fare} BDT</span>
                </div>
                {ride.description && (
                  <div className="flex items-start space-x-2">
                    <span className="font-semibold">Description:</span>
                    <span>{ride.description}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-row md:flex-col justify-end space-x-2 md:space-x-0 md:space-y-2 mt-4 md:mt-0">
                {userType === "rider" && ride.status === "active" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCompleteRide(ride._id)}
                      disabled={processingRideId === ride._id}
                    >
                      {processingRideId === ride._id ? "Processing..." : "Mark as Completed"}
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={processingRideId === ride._id}>
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the ride.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteRide(ride._id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

