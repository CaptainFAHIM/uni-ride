"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { registerUser } from "../actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userType, setUserType] = useState("passenger")
  const [university, setUniversity] = useState("")

  const universities = [
    "Dhaka University",
    "BUET",
    "North South University",
    "BRAC University",
    "East West University",
    "Jahangirnagar University",
    "American International University-Bangladesh",
    "Independent University, Bangladesh",
    "Daffodil International University",
  ]

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)

    try {
      const result = await registerUser(formData)

      if (result.error) {
        toast({
          title: "Registration Failed",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Registration Successful",
          description: "Welcome to UniRide!",
        })
        router.push("/dashboard")
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">Enter your details to register for UniRide</CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="john@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label>User Type</Label>
              <RadioGroup
                defaultValue="passenger"
                name="userType"
                value={userType}
                onValueChange={setUserType}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="passenger" id="passenger" />
                  <Label htmlFor="passenger">Passenger (I need rides)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rider" id="rider" />
                  <Label htmlFor="rider">Rider (I have a vehicle)</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <Select name="university" value={university} onValueChange={setUniversity} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your university" />
                </SelectTrigger>
                <SelectContent>
                  {universities.map((uni) => (
                    <SelectItem key={uni} value={uni}>
                      {uni}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

