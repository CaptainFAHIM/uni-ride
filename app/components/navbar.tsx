"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, User, Car, MessageSquare, CreditCard, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logoutUser } from "../actions/auth-actions"
import { ThemeToggle } from "./theme-toggle"

interface NavbarProps {
  user: any
}

export default function Navbar({ user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <User className="h-5 w-5 mr-2" />,
    },
    {
      name: "Find Rides",
      href: "/rides",
      icon: <Car className="h-5 w-5 mr-2" />,
    },
    {
      name: "Messages",
      href: "/messages",
      icon: <MessageSquare className="h-5 w-5 mr-2" />,
    },
    {
      name: "Membership",
      href: "/membership",
      icon: <CreditCard className="h-5 w-5 mr-2" />,
    },
  ]

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">UniRide</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user &&
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === link.href ? "bg-primary-foreground text-primary" : "hover:bg-primary-foreground/10"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}

            <ThemeToggle />

            {user && (
              <form action={logoutUser}>
                <Button variant="ghost" className="flex items-center hover:bg-primary-foreground/10" type="submit">
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </form>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-primary-foreground/10 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user &&
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === link.href ? "bg-primary-foreground text-primary" : "hover:bg-primary-foreground/10"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}

            {user && (
              <form action={logoutUser}>
                <Button
                  variant="ghost"
                  className="flex items-center w-full justify-start hover:bg-primary-foreground/10"
                  type="submit"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

