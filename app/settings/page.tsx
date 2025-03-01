'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState({
    notifications: true,
    units: 'metric',
    language: 'en'
  })

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Settings</h1>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="p-4 border rounded-lg dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Appearance</h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
            <button
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                theme === 'dark' ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </div>

        <div className="p-4 border rounded-lg dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Navigation</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Units</span>
              <select
                value={settings.units}
                onChange={(e) => setSettings(s => ({ ...s, units: e.target.value }))}
                className="p-2 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                <option value="metric">Metric (km)</option>
                <option value="imperial">Imperial (mi)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Language</span>
              <select
                value={settings.language}
                onChange={(e) => setSettings(s => ({ ...s, language: e.target.value }))}
                className="p-2 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Notifications</h2>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Enable Notifications</span>
            <button
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                settings.notifications ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
              onClick={() => setSettings(s => ({ ...s, notifications: !s.notifications }))}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.notifications ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 