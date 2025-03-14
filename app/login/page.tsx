"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { loginUser } from "../actions/auth-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)

    try {
      const result = await loginUser(formData)

      if (result.error) {
        toast({
          title: "Login Failed",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Login Successful",
          description: "Welcome back to UniRide!",
        })
        router.push("/dashboard")
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Demo user credentials
  const demoRider = {
    email: "rider@example.com",
    password: "password123",
  }

  const demoPassenger = {
    email: "passenger@example.com",
    password: "password123",
  }

  const loginAsDemo = async (userType: "rider" | "passenger") => {
    const demoUser = userType === "rider" ? demoRider : demoPassenger
    const formData = new FormData()
    formData.append("email", demoUser.email)
    formData.append("password", demoUser.password)
    await handleSubmit(formData)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login to UniRide</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="john@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register
              </Link>
            </div>

            <div className="border-t pt-4">
              <p className="text-center text-sm mb-2">Or try with demo accounts:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant="outline" onClick={() => loginAsDemo("rider")} disabled={isSubmitting}>
                  Demo Rider
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => loginAsDemo("passenger")}
                  disabled={isSubmitting}
                >
                  Demo Passenger
                </Button>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

