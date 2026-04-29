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
        <div className="relative overflow-hidden bg-[#fffff4] font-['Montserrat']">
          <div className="relative w-full max-w-[1440px] mx-auto flex flex-col gap-8 items-center justify-center px-6 py-16 md:flex-row md:justify-between md:px-8 md:py-24">
            <img src="./illustrations/db1-hero.png" alt="" className="w-full max-w-[320px] flex-shrink-0" style={{ height: 'auto' }} />
            <div className="text-center md:text-left max-w-3xl">
              <div className="font-bold uppercase text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] text-[#00AAFF]">
                <div>Explore the Leaders</div>
                <div>Bridging the Gap</div>
                <div>in Digital Health</div>
              </div>
            </div>
            <img src="./illustrations/db2-hero.png" alt="" className="w-full max-w-[300px] flex-shrink-0" style={{ height: 'auto' }} />
          </div>
        </div>
      )}

      {route === 'analytics' && (
        <div className="relative overflow-hidden bg-[#fffff4] font-['Montserrat']">
          <div className="relative w-full max-w-[1440px] mx-auto flex flex-col gap-8 items-center justify-center px-6 py-16 md:flex-row md:justify-between md:px-8 md:py-24">
            <img src="./illustrations/network2-hero.png" alt="" className="w-full max-w-[320px] flex-shrink-0" style={{ height: 'auto' }} />
            <div className="text-center md:text-left max-w-3xl">
              <div className="font-bold uppercase text-[clamp(2.25rem,5vw,4rem)] leading-[1.05]">
                <div className="text-[#02598e]">Global</div>
                <div className="text-[#F85A8E]">Network</div>
              </div>
              <p className="mt-4 max-w-[28rem] text-base leading-7 text-[#333] md:text-lg">
                A curated community of health leaders driving digital transformation
              </p>
            </div>
            <img src="./illustrations/network1-hero.png" alt="" className="w-full max-w-[300px] flex-shrink-0" style={{ height: 'auto' }} />
          </div>
        </div>
      )}

      {route === 'submit' && (
        <div className="relative overflow-hidden bg-[#fffff4] font-['Montserrat']">
          <div className="relative w-full max-w-[1440px] mx-auto flex flex-col gap-8 items-center justify-center px-6 py-16 md:flex-row md:justify-between md:px-8 md:py-24">
            <img src="./illustrations/hero-left.png" alt="" className="w-full max-w-[320px] flex-shrink-0" style={{ height: 'auto' }} />
            <div className="text-center md:text-left max-w-3xl">
              <div className="font-bold uppercase text-[clamp(2.25rem,5vw,4rem)] leading-[1.05]">
                <div className="text-[#02598e]">Join</div>
                <div className="text-[#F85A8E]">The</div>
                <div className="text-[#F85A8E]">Database</div>
              </div>
            </div>
            <img src="./illustrations/hero-right.png" alt="" className="w-full max-w-[300px] flex-shrink-0" style={{ height: 'auto' }} />
          </div>
        </div>
      )}

      <nav className="sticky top-0 z-50" style={{ background: '#FADF56' }}>
        <div className="max-w-[1440px] mx-auto px-8 pt-6 pb-0 flex justify-between items-end">

          {/* Main tabs */}
          <div className="flex gap-6 items-end">
            {NAV_ITEMS.filter(item => item.id !== 'admin').map((item) => {
              const active = route === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setRoute(item.id)}
                  className={`font-['Montserrat'] font-medium text-xl tracking-[0.03em] px-8 h-11 whitespace-nowrap cursor-pointer ${
                    active ? 'text-white bg-[#E8571D]' : 'text-black bg-transparent'
                  }`}
                  style={active ? {
                    transform: 'skewX(-10deg)',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  } : {}}
                >
                  <span style={active ? { display: 'inline-block', transform: 'skewX(10deg)' } : {}}>
                    {item.display}
                  </span>
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
            {route === 'submit' && <Submit onManageProfile={() => goToManage()} onGoToDirectory={() => setRoute('database')} />}
            {route === 'analytics' && <Analytics onManageProfile={() => goToManage()} />}
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
