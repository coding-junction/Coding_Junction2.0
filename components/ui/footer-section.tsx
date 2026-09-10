"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Instagram, Linkedin, Moon, Send, Sun, Github } from "lucide-react"

import { useTheme } from "next-themes"

function Footerdemo() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDarkMode = theme === "dark"

  return (
    <footer className="relative w-full max-w-full overflow-hidden border-t border-transparent bg-background text-foreground transition-colors duration-300 pb-24 md:pb-0">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">Stay Connected</h2>
            <p className="mb-6 text-muted-foreground">
            If you are thinking or interested in joining the club or want to know more about us, connect with us by dropping your Email-ID with us. We will be glad to get in touch with you.
            </p>
            <form className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className="pr-12 backdrop-blur-sm"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl hidden md:block" />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              <Link href="/" className="block transition-colors hover:text-primary">
                Home
              </Link>
              <Link href="/Events" className="block transition-colors hover:text-primary">
                Events
              </Link>
              <Link href="/Team" className="block transition-colors hover:text-primary">
                Team
              </Link>
              <Link href="/Gallery" className="block transition-colors hover:text-primary">
                Gallery
              </Link>
              <Link href="/CommunityPartners" className="block transition-colors hover:text-primary">
                Community Partners
              </Link>
              <Link href="/mobile-app" className="block transition-colors hover:text-primary">
                Mobile App
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <address className="space-y-2 text-sm not-italic text-muted-foreground">
              <p className="text-foreground font-medium">UIT, Burdwan</p>
              <p>Purba Bardhaman, West Bengal, India</p>
              <p>
                Email:{" "}
                <a href="mailto:ranadebsaha@coding-junction.in" className="text-foreground hover:text-indigo-500 transition-colors">
                  ranadebsaha@coding-junction.in
                </a>
              </p>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
            <div className="mb-6 flex space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white hover:border-pink-500 transition-all duration-300" asChild>
                      <a href="https://www.instagram.com/codingjunction_uitbu/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <Instagram className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Instagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300" asChild>
                      <a href="https://linkedin.com/company/coding-junction" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connect with us on LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-gray-900 hover:text-white hover:border-gray-900 dark:hover:bg-white dark:hover:text-black transition-all duration-300" asChild>
                      <a href="https://github.com/Coding-Junction" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Check out our GitHub</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch
                id="dark-mode"
                checked={mounted ? isDarkMode : true}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
              <Moon className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="dark-mode" className="sr-only">
                Toggle dark mode
              </Label>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-center md:flex-row">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/CodingJunction_withText_black_withoutBackground.png"
              alt="Coding Junction"
              width={140}
              height={45}
              className="h-10 w-auto object-contain dark:invert dark:brightness-200"
            />
            <p className="text-sm text-muted-foreground ml-2">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/privacy" className="transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/cookies" className="transition-colors hover:text-primary">
              Cookie Settings
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { Footerdemo }