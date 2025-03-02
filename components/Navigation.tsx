'use client'

import Link from "next/link"
import { Menu, X, MapPin, User } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface MenuItem {
  href: string;
  label: string;
  isButton?: boolean;
}

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }
    
    // Initial check
    checkAuth()

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  const menuItems: MenuItem[] = [
    { href: '/map', label: 'Map' },
    { href: '/search', label: 'Search' },
    ...(isAuthenticated 
      ? [
          { href: '/favorites', label: 'Saved Places' },
          { href: '/settings', label: 'Settings' }
        ] 
      : [
          { href: '/auth', label: 'Sign In', isButton: true }
        ]
    )
  ]

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setIsAuthenticated(false)
      // Use router.push instead of window.location for better navigation
      window.location.href = '/map'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="sticky top-0 z-[100] w-full">
      <div className="glass-effect px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold gradient-text">
            NaviGo
          </Link>
          
          {/* Single Hamburger/Close Menu Button */}
          <button 
            className="text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 z-[120]"
            onClick={(e) => {
              e.stopPropagation()
              setIsMobileMenuOpen(!isMobileMenuOpen)
            }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Menu Panel */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90]"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                
                <motion.div
                  ref={menuRef}
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: "tween", duration: 0 }}
                  className="fixed top-0 right-0 h-screen w-64 bg-white dark:bg-gray-900 z-[110]"
                  style={{ height: '100dvh' }}
                >
                  <div className="pt-[60px] flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto px-4 py-4">
                      {menuItems.map((item, index) => (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            className={`block py-3 px-6 text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 border-b border-gray-100 dark:border-gray-800 ${
                              item.isButton ? 'border-none mt-4 mx-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-center' : ''
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      ))}
                      {isAuthenticated && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ delay: menuItems.length * 0.1 }}
                        >
                          <button
                            onClick={() => {
                              handleSignOut()
                              setIsMobileMenuOpen(false)
                            }}
                            className="block w-full text-left py-3 px-6 text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 border-b border-gray-100 dark:border-gray-800"
                          >
                            Sign Out
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  )
}

export default Navigation

