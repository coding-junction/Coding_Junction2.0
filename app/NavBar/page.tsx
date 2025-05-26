"use client"

import * as React from "react"
import { Home, User, AppWindowIcon, LogInIcon, ImageIcon } from "lucide-react"
import { AnimeNavBar } from "@/components/ui/anime-navbar"

const items = [
  {
    name: "Home",
    url: "/",
    href: "#",
    icon: Home,
  },
  {
    name: "Team",
    url: "/Team",
    href: "#",
    icon: User,
  },
  {
    name: "App",
    url: "/App",
    href: "#",
    icon: AppWindowIcon,
  },
  {
    name: "Gallery",
    url: "/Gallery",
    href: "#",
    icon: ImageIcon,
  },
  {
    name: "Login",
    url: "/sign-in",
    href: "#",
    icon: LogInIcon,
  },
]

const NavBar = () => {
  return <AnimeNavBar items={items} defaultActive="Home" />
};

export default NavBar
