'use client'

import { createContext, useContext } from 'react'
import { ThemePreference } from '@/types/database'

interface ThemeContextType {
  theme: ThemePreference
  setTheme: (theme: ThemePreference) => Promise<void>
  loading: boolean
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
