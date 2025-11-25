'use client'

import { useEffect, useState } from 'react'
import { ThemeContext } from './ThemeContext'
import { ThemePreference } from '@/types/database'
import { useAuth } from './AuthContext'
import { createClient } from '@/lib/supabase/client'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth()
  const [theme, setThemeState] = useState<ThemePreference>('light')
  const [loading, setLoading] = useState(true)

  // Load theme from user profile or localStorage
  useEffect(() => {
    const loadTheme = () => {
      if (profile?.theme_preference) {
        // Use theme from user profile in database
        setThemeState(profile.theme_preference)
        applyTheme(profile.theme_preference)
      } else if (!user) {
        // For non-authenticated users, use localStorage
        const savedTheme = localStorage.getItem('theme') as ThemePreference
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setThemeState(savedTheme)
          applyTheme(savedTheme)
        } else {
          applyTheme('light')
        }
      }
      setLoading(false)
    }

    loadTheme()
  }, [profile, user])

  const applyTheme = (newTheme: ThemePreference) => {
    const root = document.documentElement
    if (newTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  const setTheme = async (newTheme: ThemePreference) => {
    setThemeState(newTheme)
    applyTheme(newTheme)

    if (user) {
      // Save to database for authenticated users
      const supabase = createClient()
      const { error } = await supabase
        .from('users')
        .update({ theme_preference: newTheme })
        .eq('id', user.id)

      if (error) {
        console.error('Error updating theme preference:', error)
      }
    } else {
      // Save to localStorage for non-authenticated users
      localStorage.setItem('theme', newTheme)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  )
}
