import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">UniRide</h1>
          <div className="space-x-4">
            {user ? (
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              University Ride Sharing Made Easy
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Connect with fellow students for affordable and convenient rides to and from your university.
            </p>
            {!user && (
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">Get Started</Button>
              </Link>
            )}
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2">Register as a Rider or Passenger</h3>
                <p>Sign up and specify whether you have a vehicle or need a ride to your university.</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2">Find or Offer Rides</h3>
                <p>Riders can post their commute details, while passengers can search for available rides.</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2">Connect and Travel Together</h3>
                <p>Message each other, arrange pickup details, and share the ride to save money and reduce traffic.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose UniRide?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <div className="mr-4 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Save Money</h3>
                  <p>Share fuel costs and reduce your daily commute expenses.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Reduce Traffic</h3>
                  <p>Fewer cars on the road means less congestion and pollution.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} UniRide. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
