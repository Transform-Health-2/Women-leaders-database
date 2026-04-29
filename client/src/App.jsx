import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Database from './pages/Database'
import Submit from './pages/Submit'
import Admin from './pages/Admin'
import Analytics from './pages/Analytics'
import ManageProfile from './pages/ManageProfile'

const NAV_ITEMS = [
  { id: 'database', label: 'Database' },
  { id: 'submit', label: 'Submit' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'admin', label: 'Admin' },
]

export default function App() {
  const [route, setRoute] = useState('database')
  const [managePrefill, setManagePrefill] = useState(null)
  const [tokenLoading, setTokenLoading] = useState(false)
  const [tokenError, setTokenError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (!token) return

    const url = import.meta.env.VITE_APPS_SCRIPT_URL
    if (!url) return

    setTokenLoading(true)
    window.history.replaceState({}, '', window.location.pathname)

    axios
      .get(`${url}?api=profile&token=${token}`)
      .then((r) => {
        if (r.data?.ok && r.data?.profile) {
          setManagePrefill({ ...r.data.profile, _verified: true })
          setRoute('manage')
        } else {
          setTokenError(
            r.data?.error === 'token_used'
              ? 'This link has already been used. Please request a new one.'
              : 'This link is invalid or has expired. Please request a new one.'
          )
        }
      })
      .catch(() => {
        setTokenError('Could not load your profile. Please try again.')
      })
      .finally(() => setTokenLoading(false))
  }, [])

  function goToManage(profile = null) {
    setManagePrefill(profile)
    setRoute('manage')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-8">
              <h1 className="text-lg font-semibold text-gray-900">
                Transform Health
              </h1>
              <div className="flex gap-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setRoute(item.id)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                      route === item.id
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main>
        {tokenLoading ? (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-gray-500">Loading your profile...</p>
          </div>
        ) : tokenError ? (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center max-w-md">
              <div className="text-3xl mb-4">⚠</div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Link unavailable</h2>
              <p className="text-gray-600 text-sm mb-4">{tokenError}</p>
              <button
                onClick={() => { setTokenError(''); setRoute('manage') }}
                className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium hover:bg-gray-700"
              >
                Request a new link
              </button>
            </div>
          </div>
        ) : (
          <>
            {route === 'database' && <Database onManageProfile={(profile) => goToManage(profile)} />}
            {route === 'submit' && <Submit onManageProfile={() => goToManage()} />}
            {route === 'analytics' && <Analytics />}
            {route === 'admin' && <Admin />}
            {route === 'manage' && (
              <ManageProfile
                prefill={managePrefill}
                onBack={() => setRoute(managePrefill?._verified || managePrefill ? 'database' : 'submit')}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
