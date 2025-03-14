"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { processPayment, getPaymentHistory } from "@/app/actions/payment-actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { getCurrentUser, checkMembership } from "@/lib/auth"

export default function MembershipPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentHistory, setPaymentHistory] = useState<any[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isMembershipActive, setIsMembershipActive] = useState(false)

  useState(() => {
    async function loadData() {
      try {
        // Get current user
        const userData = await getCurrentUser()
        setUser(userData)

        // Check membership status
        const membershipStatus = await checkMembership(userData)
        setIsMembershipActive(membershipStatus)
      } catch (error) {
        console.error("Error loading user data:", error)
      }
    }

    loadData()
  }, [])

  async function handlePayment(formData: FormData) {
    setIsProcessing(true)

    try {
      const result = await processPayment(formData)

      if (result.error) {
        toast({
          title: "Payment Failed",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Payment Successful",
          description: "Your membership has been renewed.",
        })
        setIsMembershipActive(true)
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  async function handleViewHistory() {
    try {
      const result = await getPaymentHistory()

      if (result.error) {
        toast({
          title: "Failed to Load History",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setPaymentHistory(result.payments)
        setShowHistory(true)
      }
    } catch (error) {
      toast({
        title: "Failed to Load History",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Membership</h1>
        <p className="text-muted-foreground">Manage your UniRide membership</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membership Status</CardTitle>
          <CardDescription>Your current membership information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Status</p>
                  <p
                    className={`text-lg font-bold ${isMembershipActive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {isMembershipActive ? "Active" : "Expired"}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isMembershipActive
                      ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                      : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                  }`}
                >
                  {isMembershipActive ? "✓" : "✗"}
                </div>
              </div>
            </div>

            {user && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Membership Type</p>
                  <p className="text-sm text-muted-foreground capitalize">{user.userType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Fee</p>
                  <p className="text-sm text-muted-foreground">
                    {user.userType === "rider" ? "70" : "50"} BDT per month
                  </p>
                </div>
                {isMembershipActive && user.membershipExpiry && (
                  <div>
                    <p className="text-sm font-medium">Expiry Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user.membershipExpiry).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <Button variant="outline" onClick={handleViewHistory}>
                View Payment History
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {(!isMembershipActive || true) && (
        <Card>
          <CardHeader>
            <CardTitle>Renew Membership</CardTitle>
            <CardDescription>Pay your membership fee to continue using UniRide</CardDescription>
          </CardHeader>
          <form action={handlePayment}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input id="expiryDate" name="expiryDate" placeholder="MM/YY" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" name="cvv" placeholder="123" required />
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="font-medium">Payment Summary</p>
                <div className="flex justify-between mt-2">
                  <p>Membership Fee ({user?.userType === "rider" ? "Rider" : "Passenger"})</p>
                  <p className="font-bold">{user?.userType === "rider" ? "70" : "50"} BDT</p>
                </div>
                <div className="flex justify-between mt-1">
                  <p>Duration</p>
                  <p>1 Month</p>
                </div>
                <div className="border-t mt-2 pt-2 flex justify-between">
                  <p className="font-bold">Total</p>
                  <p className="font-bold">{user?.userType === "rider" ? "70" : "50"} BDT</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? "Processing Payment..." : "Pay Now"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {showHistory && (
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your previous membership payments</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No payment history found.</div>
            ) : (
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div key={payment._id} className="p-4 rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm font-medium">Date</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Amount</p>
                        <p className="text-sm text-muted-foreground">{payment.amount} BDT</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Membership Type</p>
                        <p className="text-sm text-muted-foreground capitalize">{payment.membershipType}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Transaction ID</p>
                        <p className="text-sm text-muted-foreground">{payment.transactionId}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

