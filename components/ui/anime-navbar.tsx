"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Navigation Item Interface
interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

// Navigation Bar Props Interface
interface NavBarProps {
  items: NavItem[]
  className?: string
  defaultActive?: string
}

export function AnimeNavBar({ 
  items, 
  className, 
  defaultActive = "Home" 
}: NavBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  // State Management
  const [mounted, setMounted] = useState(false)
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>(defaultActive)
  const [isMobile, setIsMobile] = useState(false)

  // Mounted Effect
  useEffect(() => {
    setMounted(true)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Pathname Change Effect
  useEffect(() => {
    const currentItem = items.find(item => item.url === pathname)
    if (currentItem) {
      setActiveTab(currentItem.name)
    }
  }, [pathname, items])

  // Prevent rendering before client-side mount
  if (!mounted) return null

  // Navigation Handler
  const handleNavigation = (item: NavItem) => {
    setActiveTab(item.name)
    router.push(item.url)
  }

  return (
    <div
      className={cn(
        // Lower on mobile for mascot space, tighter on desktop
        "fixed left-0 right-0 z-[9999]",
        isMobile ? "top-3" : "top-5",
        className
      )}
    >
      <div className={cn("flex justify-center", isMobile ? "pt-2" : "pt-6")}>
        <motion.div 
          className={cn(
            "flex items-center bg-black/50 border border-white/10 backdrop-blur-lg rounded-full shadow-lg relative",
            isMobile
              ? "gap-1 py-1 px-1 max-w-[95vw] overflow-x-auto"
              : "gap-3 py-2 px-2"
          )}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          {items.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.name
            const isHovered = hoveredTab === item.name

            return (
              <div 
                key={item.name}
                onClick={() => handleNavigation(item)}
                onMouseEnter={() => setHoveredTab(item.name)}
                onMouseLeave={() => setHoveredTab(null)}
                className={cn(
                  "relative cursor-pointer font-semibold rounded-full transition-all duration-300 whitespace-nowrap select-none",
                  isMobile
                    ? "text-base px-3 py-2"
                    : "text-sm px-6 py-3",
                  "text-white/70 hover:text-white",
                  isActive && "text-white"
                )}
              >
                {/* Active Tab Background */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full -z-10 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0.3, 0.5, 0.3],
                      scale: [1, 1.03, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="absolute inset-0 bg-primary/25 rounded-full blur-md" />
                    <div className="absolute inset-[-4px] bg-primary/20 rounded-full blur-xl" />
                    <div className="absolute inset-[-8px] bg-primary/15 rounded-full blur-2xl" />
                    <div className="absolute inset-[-12px] bg-primary/5 rounded-full blur-3xl" />
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0"
                      style={{
                        animation: "shine 3s ease-in-out infinite"
                      }}
                    />
                  </motion.div>
                )}

                {/* Desktop Text */}
                <motion.span
                  className="hidden md:inline relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.span>

                {/* Mobile Icon */}
                <motion.span 
                  className="md:hidden relative z-10"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={22} strokeWidth={2.5} />
                </motion.span>
          
                {/* Hover Effect */}
                <AnimatePresence>
                  {isHovered && !isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    />
                  )}
                </AnimatePresence>

                {/* Animated Mascot */}
                {isActive && (
                  <motion.div
                    layoutId="anime-mascot"
                    className={cn(
                      "absolute left-1/2 -translate-x-1/2 pointer-events-none z-[10000]",
                      isMobile ? "-top-4" : "-top-12"
                    )}
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className={cn(
                      "relative",
                      isMobile ? "w-8 h-8" : "w-12 h-12"
                    )}>
                      <motion.div 
                        className={cn(
                          "absolute bg-white rounded-full left-1/2 -translate-x-1/2",
                          isMobile ? "w-7 h-7" : "w-10 h-10"
                        )}
                        animate={
                          hoveredTab ? {
                            scale: [1, 1.1, 1],
                            rotate: [0, -5, 5, 0],
                            transition: {
                              duration: 0.5,
                              ease: "easeInOut"
                            }
                          } : {
                            y: [0, -3, 0],
                            transition: {
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }
                          }
                        }
                      >
                        {/* Mascot Eyes */}
                        <motion.div 
                          className={cn(
                            "absolute bg-black rounded-full",
                            isMobile ? "w-1 h-1" : "w-2 h-2"
                          )}
                          animate={
                            hoveredTab ? {
                              scaleY: [1, 0.2, 1],
                              transition: {
                                duration: 0.2,
                                times: [0, 0.5, 1]
                              }
                            } : {}
                          }
                          style={{ left: isMobile ? '22%' : '25%', top: '40%' }}
                        />
                        <motion.div 
                          className={cn(
                            "absolute bg-black rounded-full",
                            isMobile ? "w-1 h-1" : "w-2 h-2"
                          )}
                          animate={
                            hoveredTab ? {
                              scaleY: [1, 0.2, 1],
                              transition: {
                                duration: 0.2,
                                times: [0, 0.5, 1]
                              }
                            } : {}
                          }
                          style={{ right: isMobile ? '22%' : '25%', top: '40%' }}
                        />

                        {/* Mascot Blush */}
                        <motion.div 
                          className={cn(
                            "absolute bg-pink-300 rounded-full",
                            isMobile ? "w-1.5 h-0.5" : "w-2 h-1.5"
                          )}
                          animate={{
                            opacity: hoveredTab ? 0.8 : 0.6
                          }}
                          style={{ left: isMobile ? '10%' : '15%', top: isMobile ? '55%' : '55%' }}
                        />
                        <motion.div 
                          className={cn(
                            "absolute bg-pink-300 rounded-full",
                            isMobile ? "w-1.5 h-0.5" : "w-2 h-1.5"
                          )}
                          animate={{
                            opacity: hoveredTab ? 0.8 : 0.6
                          }}
                          style={{ right: isMobile ? '10%' : '15%', top: isMobile ? '55%' : '55%' }}
                        />
                        
                        {/* Mascot Mouth */}
                        <motion.div 
                          className={cn(
                            "absolute border-b-2 border-black rounded-full",
                            isMobile ? "w-2 h-1" : "w-4 h-2"
                          )}
                          animate={
                            hoveredTab ? {
                              scaleY: 1.5,
                              y: -1
                            } : {
                              scaleY: 1,
                              y: 0
                            }
                          }
                          style={{ left: isMobile ? '25%' : '30%', top: isMobile ? '62%' : '60%' }}
                        />

                        {/* Sparkle Effects */}
                        <AnimatePresence>
                          {hoveredTab && (
                            <>
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className={cn(
                                  "absolute text-yellow-300",
                                  isMobile ? "-top-1 -right-1 w-1 h-1" : "-top-1 -right-1 w-2 h-2"
                                )}
                              >
                                ✨
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ delay: 0.1 }}
                                className={cn(
                                  "absolute text-yellow-300",
                                  isMobile ? "-top-2 left-0 w-1 h-1" : "-top-2 left-0 w-2 h-2"
                                )}
                              >
                                ✨
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Mascot Base */}
                      <motion.div
                        className={cn(
                          "absolute left-1/2 -translate-x-1/2",
                          isMobile ? "-bottom-1 w-2 h-2" : "-bottom-1 w-4 h-4"
                        )}
                        animate={
                          hoveredTab ? {
                            y: [0, -4, 0],
                            transition: {
                              duration: 0.3,
                              repeat: Infinity,
                              repeatType: "reverse"
                            }
                          } : {
                            y: [0, 2, 0],
                            transition: {
                              duration: 1,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 0.5
                            }
                          }
                        }
                      >
                        <div className="w-full h-full bg-white rotate-45 transform origin-center" />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}