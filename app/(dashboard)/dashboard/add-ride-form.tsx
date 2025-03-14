"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addRide } from "@/app/actions/ride-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

interface AddRideFormProps {
  isMembershipActive: boolean
}

export function AddRideForm({ isMembershipActive }: AddRideFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    if (!isMembershipActive) {
      toast({
        title: "Membership Required",
        description: "Please renew your membership to add rides.",
        variant: "destructive",
      })
      router.push("/membership")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await addRide(formData)

      if (result.error) {
        toast({
          title: "Failed to Add Ride",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Ride Added",
          description: "Your ride has been added successfully.",
        })
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Failed to Add Ride",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="university">University</Label>
          <Input id="university" name="university" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startLocation">Starting Location</Label>
          <Input id="startLocation" name="startLocation" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="departureTime">Departure Time</Label>
          <Input id="departureTime" name="departureTime" type="datetime-local" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="availableSeats">Available Seats</Label>
          <Input id="availableSeats" name="availableSeats" type="number" min="1" max="10" defaultValue="1" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fare">Fare (BDT)</Label>
          <Input id="fare" name="fare" type="number" min="0" defaultValue="50" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea id="description" name="description" placeholder="Add any additional details about your ride..." />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !isMembershipActive}>
          {isSubmitting ? "Adding..." : "Add Ride"}
        </Button>
      </div>

      {!isMembershipActive && (
        <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-md text-sm text-yellow-800 dark:text-yellow-400">
          Your membership has expired.
          <Link href="/membership" className="ml-1 underline font-medium">
            Renew your membership
          </Link>{" "}
          to add rides.
        </div>
      )}
    </form>
  )
}

