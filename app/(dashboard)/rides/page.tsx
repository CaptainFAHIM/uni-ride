"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { searchAvailableRides } from "@/app/actions/ride-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export default function RidesPage() {
  const router = useRouter()
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[] | null>(null)

  async function handleSearch(formData: FormData) {
    setIsSearching(true)

    try {
      const result = await searchAvailableRides(formData)

      if (result.error) {
        toast({
          title: "Search Failed",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setSearchResults(result.rides)
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Find Rides</h1>
        <p className="text-muted-foreground">Search for available rides to your university</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Rides</CardTitle>
          <CardDescription>Enter your university and starting location to find available rides</CardDescription>
        </CardHeader>
        <form action={handleSearch}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <Input id="university" name="university" placeholder="e.g. Dhaka University" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startLocation">Starting Location</Label>
                <Input id="startLocation" name="startLocation" placeholder="e.g. Mirpur" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSearching}>
              {isSearching ? "Searching..." : "Search Rides"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {searchResults && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>Found {searchResults.length} available rides</CardDescription>
          </CardHeader>
          <CardContent>
            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No rides found matching your criteria. Try different search terms.
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.map((ride) => (
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
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">Rider:</span>
                            <span>{ride.rider.name}</span>
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col justify-end space-x-2 md:space-x-0 md:space-y-2 mt-4 md:mt-0">
                          <Link href={`/messages/${ride.rider._id}/${ride._id}`}>
                            <Button size="sm">Contact Rider</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

