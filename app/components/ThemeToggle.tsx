'use client'

import { useTheme } from '../contexts/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center justify-between p-6 bg-primary-bg rounded-lg border border-border-default">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-text-primary mb-1">Appearance</h3>
        <p className="text-sm text-text-secondary">
          Choose your preferred color scheme
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setTheme('light')}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
            ${theme === 'light'
              ? 'bg-brand-purple text-white border-brand-purple'
              : 'bg-secondary-bg text-text-secondary border-border-default hover:border-border-hover'
            }
          `}
        >
          <Sun size={18} />
          <span>Light</span>
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
            ${theme === 'dark'
              ? 'bg-brand-purple text-white border-brand-purple'
              : 'bg-secondary-bg text-text-secondary border-border-default hover:border-border-hover'
            }
          `}
        >
          <Moon size={18} />
          <span>Dark</span>
        </button>
      </div>
    </div>
  )
}
