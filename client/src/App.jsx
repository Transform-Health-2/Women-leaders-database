import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Database from './pages/Database'
import Submit from './pages/Submit'
import Admin from './pages/Admin'
import Analytics from './pages/Analytics'
import ManageProfile from './pages/ManageProfile'
import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'

const NAV_ITEMS = [
  { id: 'database', label: 'Database', display: 'DATABASE' },
  { id: 'submit', label: 'Submit', display: 'SUBMIT PROFILE' },
  { id: 'analytics', label: 'Analytics', display: 'ANALYTICS' },
  { id: 'admin', label: 'Admin', display: 'ADMIN' },
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

  const showHero = ['database', 'submit', 'analytics'].includes(route)

  return (
    <div className="min-h-screen" style={{ background: 'rgb(255, 255, 244)' }}>
      <SiteHeader />

      {route === 'database' && (
        <div style={{ position: 'relative', overflow: 'hidden', background: '#fffff4', fontFamily: "'Montserrat', sans-serif", height: 467 }}>
          <div style={{ position: 'relative', height: '100%', maxWidth: 1440, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <img src="/illustrations/db1-hero.png" alt="" style={{ height: 260, width: 'auto', flexShrink: 0 }} />
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 64, lineHeight: 1.1, textTransform: 'uppercase', textAlign: 'left' }}>
              <div style={{ color: '#00AAFF' }}>Explore the Leaders</div>
              <div style={{ color: '#00AAFF' }}>Bridging the Gap</div>
              <div style={{ color: '#00AAFF' }}>in Digital Health</div>
            </div>
            <img src="/illustrations/db2-hero.png" alt="" style={{ height: 240, width: 'auto', flexShrink: 0 }} />
          </div>
        </div>
      )}

      {route === 'analytics' && (
        <div style={{ position: 'relative', overflow: 'hidden', background: '#fffff4', fontFamily: "'Montserrat', sans-serif", height: 467 }}>
          <div style={{ position: 'relative', height: '100%', maxWidth: 1440, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <img src="/illustrations/network2-hero.png" alt="" style={{ height: 260, width: 'auto', flexShrink: 0 }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 64, lineHeight: 1.1, textTransform: 'uppercase' }}>
                <div style={{ color: '#02598e' }}>Global</div>
                <div style={{ color: '#F85A8E' }}>Network</div>
              </div>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 18, fontWeight: 400, color: '#333', marginTop: 16, maxWidth: 480, lineHeight: 1.6 }}>
                A curated community of health leaders driving digital transformation
              </p>
            </div>
            <img src="/illustrations/network1-hero.png" alt="" style={{ height: 240, width: 'auto', flexShrink: 0 }} />
          </div>
        </div>
      )}

      {route === 'submit' && (
        <div style={{ position: 'relative', overflow: 'hidden', background: '#fffff4', fontFamily: "'Montserrat', sans-serif", height: 467 }}>
          <div style={{ position: 'relative', height: '100%', maxWidth: 1440, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <img src="/illustrations/hero-left.png" alt="" style={{ height: 260, width: 'auto', flexShrink: 0 }} />
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 64, lineHeight: 1.1, textTransform: 'uppercase', textAlign: 'left' }}>
              <div style={{ color: '#02598e' }}>Join</div>
              <div style={{ color: '#F85A8E' }}>The</div>
              <div style={{ color: '#F85A8E' }}>Database</div>
            </div>
            <img src="/illustrations/hero-right.png" alt="" style={{ height: 240, width: 'auto', flexShrink: 0 }} />
          </div>
        </div>
      )}

      <nav className="sticky top-0 z-50" style={{ background: '#FADF56' }}>
        <div className="max-w-[1440px] mx-auto px-8 pt-8 flex justify-between items-end">

          {/* Main tabs */}
          <div className="flex gap-8">
            {NAV_ITEMS.filter(item => item.id !== 'admin').map((item) => {
              const active = route === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setRoute(item.id)}
                  className={`font-['Montserrat'] font-medium text-2xl tracking-[0.03em] px-7 py-2.5 whitespace-nowrap leading-7 cursor-pointer rounded-none ${
                    active ? 'text-white' : 'text-black bg-transparent'
                  }`}
                  style={{
                    background: active ? '#E8571D' : 'transparent',
                    clipPath: active ? 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)' : 'none',
                  }}
                >
                  {item.display}
                </button>
              )
            })}
          </div>

          {/* Admin — tucked to the right, smaller */}
          <button
            onClick={() => setRoute('admin')}
            className={`font-['Montserrat'] font-medium text-xs tracking-[0.08em] uppercase px-3.5 py-1.5 mb-1.5 cursor-pointer rounded ${
              route === 'admin'
                ? 'text-white border-transparent'
                : 'text-[#333] border border-[#555]'
            }`}
            style={{
              background: route === 'admin' ? '#E8571D' : 'transparent',
            }}
          >
            Admin
          </button>

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
      <SiteFooter />
    </div>
  )
}
