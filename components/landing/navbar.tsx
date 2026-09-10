"use client"

import * as React from "react"
import { Home, User, AppWindowIcon, LogInIcon, ImageIcon, CalendarSearchIcon, LayoutDashboard } from "lucide-react"
import { AnimeNavBar } from "@/components/ui/anime-navbar"
import { useAuth } from "@clerk/nextjs"

const NavBar = () => {
  const { isSignedIn, isLoaded } = useAuth();

  const items = React.useMemo(() => [
    {
      name: "Home",
      url: "/",
      href: "#",
      icon: Home,
    },
    {
      name: "Events",
      url: "/Events",
      href: "#",
      icon: CalendarSearchIcon,
    },
    {
      name: "Team",
      url: "/Team",
      href: "#",
      icon: User,
    },
    {
      name: "App",
      url: "/mobile-app",
      href: "#",
      icon: AppWindowIcon,
    },
    {
      name: "Gallery",
      url: "/Gallery",
      href: "#",
      icon: ImageIcon,
    },
    isLoaded && isSignedIn
      ? {
          name: "Dashboard",
          url: "/Dashboard",
          href: "#",
          icon: LayoutDashboard,
        }
      : {
          name: "Login",
          url: "/sign-in",
          href: "#",
          icon: LogInIcon,
        },
  ], [isSignedIn, isLoaded]);

  return <AnimeNavBar items={items} defaultActive="Home" />
};

export default NavBar

