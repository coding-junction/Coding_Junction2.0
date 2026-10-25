"use client"

import * as React from "react"
import { Home, User, LogInIcon, CalendarSearchIcon, LayoutDashboard, BookOpen, Code2 } from "lucide-react"
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
      name: "Blog",
      url: "/Blog",
      href: "#",
      icon: BookOpen,
    },
    {
      name: "Projects",
      url: "/Projects",
      href: "#",
      icon: Code2,
    },
    {
      name: "Team",
      url: "/Team",
      href: "#",
      icon: User,
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

  return <AnimeNavBar items={items} defaultActive="Home" />;
};

export default NavBar


