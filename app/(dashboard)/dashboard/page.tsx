import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser, checkMembership } from "@/lib/auth"
import { getUserRides } from "@/app/actions/ride-actions"
import Link from "next/link"
import { AddRideForm } from "./add-ride-form"
import { RidesList } from "./rides-list"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const isMembershipActive = await checkMembership(user)
  const { rides } = (await getUserRides()) as any

  const activeRides = rides?.filter((ride: any) => ride.status === "active") || []
  const completedRides = rides?.filter((ride: any) => ride.status === "completed") || []

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
        </div>

        {!isMembershipActive && (
          <Card className="w-full md:w-auto bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-4">
              <p className="text-yellow-800 dark:text-yellow-400 text-sm">
                Your free trial has expired. Please renew your membership to continue using all features.
                <Link href="/membership" className="ml-2 underline font-medium">
                  Renew Now
                </Link>
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Type</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{user?.userType}</div>
            <p className="text-xs text-muted-foreground">
              {user?.userType === "rider" ? "You offer rides" : "You look for rides"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">University</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M2 22h20M12 2v15M2 13h20M2 18h20M2 8h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{user?.university}</div>
            <p className="text-xs text-muted-foreground">Your academic institution</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rides</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRides.length}</div>
            <p className="text-xs text-muted-foreground">
              {user?.userType === "rider" ? "Rides you are offering" : "Rides you are taking"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membership Status</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isMembershipActive ? "Active" : "Expired"}</div>
            <p className="text-xs text-muted-foreground">
              {isMembershipActive
                ? `Expires on ${new Date(user?.membershipExpiry).toLocaleDateString()}`
                : "Please renew your membership"}
            </p>
          </CardContent>
        </Card>
      </div>

      {user?.userType === "rider" && (
        <Card>
          <CardHeader>
            <CardTitle>Add a New Ride</CardTitle>
            <CardDescription>Share your commute details to offer rides to fellow students</CardDescription>
          </CardHeader>
          <CardContent>
            <AddRideForm isMembershipActive={isMembershipActive} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Rides</CardTitle>
          <CardDescription>
            {user?.userType === "rider" ? "Manage the rides you are offering" : "View your ride history"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Active Rides</TabsTrigger>
              <TabsTrigger value="completed">Completed Rides</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <RidesList
                rides={activeRides}
                userType={user?.userType}
                emptyMessage="You don't have any active rides."
              />
            </TabsContent>
            <TabsContent value="completed">
              <RidesList
                rides={completedRides}
                userType={user?.userType}
                emptyMessage="You don't have any completed rides."
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {user?.userType === "passenger" && (
        <div className="flex justify-center">
          <Link href="/rides">
            <Button size="lg">Find Available Rides</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

