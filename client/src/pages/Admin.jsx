import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'

const MOCK_REQUESTS = [
  {
    id: 'req_1',
    request_type: 'update',
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane@example.com',
    linkedin: 'https://linkedin.com/in/janedoe',
    changes: 'New role: Chief Digital Officer at WHO. Please also update my bio.',
    reason: '',
    submitted_at: '2026-04-28',
    status: 'pending',
  },
  {
    id: 'req_2',
    request_type: 'delete',
    first_name: 'Maria',
    last_name: 'Santos',
    email: 'maria@example.com',
    linkedin: '',
    changes: '',
    reason: 'No longer in this role.',
    submitted_at: '2026-04-29',
    status: 'pending',
  },
]

const SIDEBAR_ITEMS = [
  { id: 'pending', label: 'Pending Submissions', icon: 'inbox' },
  { id: 'requests', label: 'Profile Requests', icon: 'mail' },
  { id: 'all', label: 'All Entries', icon: 'list' },
]

function InboxIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  )
}

const ICONS = { inbox: InboxIcon, mail: MailIcon, list: ListIcon }

function getInitials(first, last) {
  return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase()
}

export default function Admin() {
  const [pending, setPending] = useState([])
  const [all, setAll] = useState([])
  const [requests, setRequests] = useState(MOCK_REQUESTS)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [actionId, setActionId] = useState(null)
  const appsScriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      if (appsScriptUrl) {
        const [pendingRes, allRes] = await Promise.all([
          axios.get(appsScriptUrl + '?api=entries&status=pending'),
          axios.get(appsScriptUrl + '?api=entries'),
        ])
        setPending(pendingRes.data || [])
        setAll(allRes.data || [])
      } else {
        const mockPending = [
          {
            id: 'th_p1',
            first_name: 'Jane',
            last_name: 'Doe',
            role: 'Health Tech Lead',
            organisation: 'HealthCorp',
            bio: 'Digital health innovator building AI solutions.',
            expertise: 'AI',
            linkedin: 'https://linkedin.com/in/janedoe',
            editor_email: 'jane@example.com',
            status: 'pending',
          },
          {
            id: 'th_p2',
            first_name: 'Maria',
            last_name: 'Santos',
            role: 'CEO',
            organisation: 'MedTech Africa',
            bio: 'Building health solutions for Africa.',
            expertise: 'Digital health innovation',
            linkedin: '',
            editor_email: 'maria@example.com',
            status: 'pending',
          },
        ]
        const mockAll = [
          ...mockPending,
          { id: 'th_a1', first_name: 'Adele', last_name: 'Waugaman', role: 'Senior Program Officer', organisation: 'Gates Foundation', bio: '', expertise: 'AI', linkedin: '', editor_email: '', status: 'live' },
          { id: 'th_a2', first_name: 'Kirsten', last_name: 'Mathieson', role: 'Deputy Director', organisation: 'Transform Health', bio: '', expertise: 'Digital health policy', linkedin: '', editor_email: '', status: 'live', featured: true },
        ]
        setPending(mockPending)
        setAll(mockAll)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleAction(id, action) {
    setActionId(id)
    try {
      if (appsScriptUrl && action !== 'reject') {
        await axios.post(
          appsScriptUrl,
          { action, id, adminPassword: 'demo' },
          { headers: { 'Content-Type': 'application/json' } }
        )
      }
      const item = all.find((i) => i.id === id)
      if (item) {
        const updated = { ...item, status: action === 'approve' ? 'live' : 'rejected' }
        setAll(all.map((i) => (i.id === id ? updated : i)))
      }
      setPending(pending.filter((p) => p.id !== id))
    } catch (e) {
      console.error(e)
    } finally {
      setActionId(null)
    }
  }

  const handleRefresh = () => loadData()

  const pendingCount = pending.length
  const requestsCount = requests.filter((r) => r.status === 'pending').length
  const allCount = all.length

  const sidebarData = [
    { ...SIDEBAR_ITEMS[0], count: pendingCount },
    { ...SIDEBAR_ITEMS[1], count: requestsCount },
    { ...SIDEBAR_ITEMS[2], count: allCount },
  ]

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="w-64 border-r border-gray-200 bg-gray-50 flex-shrink-0 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-base font-semibold text-gray-900">Admin Console</h1>
          <p className="text-xs text-gray-500 mt-0.5">Transform Health</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarData.map((item) => {
            const Icon = ICONS[item.icon]
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:bg-white hover:text-gray-900'
                }`}
              >
                <span className={isActive ? 'text-gray-900' : 'text-gray-400'}>
                  <Icon />
                </span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.count !== undefined && (
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="px-3 py-3 border-t border-gray-200">
          <button
            onClick={handleRefresh}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-white transition-colors border border-transparent hover:border-gray-200"
          >
            Refresh ↻
          </button>
        </div>
      </aside>

      <main className="flex-1 min-h-screen">
        <div className="px-8 py-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {sidebarData.find((s) => s.id === activeTab)?.label}
          </h2>
        </div>

        <div className="px-8 py-6">
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>
          ) : activeTab === 'requests' ? (
            requests.filter((r) => r.status === 'pending').length === 0 ? (
              <div className="text-center py-20">
                <div className="text-gray-200 text-5xl mb-4">✓</div>
                <div className="text-gray-400 text-sm">No pending requests</div>
              </div>
            ) : (
              <div className="space-y-3 max-w-3xl">
                {requests
                  .filter((r) => r.status === 'pending')
                  .map((req) => (
                    <div
                      key={req.id}
                      className="border border-gray-200 rounded-lg p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600 flex-shrink-0">
                              {getInitials(req.first_name, req.last_name)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {req.first_name} {req.last_name}
                              </div>
                              <div className="text-xs text-gray-500">{req.email}</div>
                            </div>
                            <span
                              className={`ml-auto text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                req.request_type === 'delete'
                                  ? 'bg-gray-100 text-gray-700'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {req.request_type === 'delete' ? 'Remove' : 'Update'}
                            </span>
                          </div>
                          {req.linkedin && (
                            <div className="text-xs text-gray-400 mb-2">
                              LinkedIn: {req.linkedin}
                            </div>
                          )}
                          {req.request_type === 'update' && req.changes && (
                            <div className="bg-gray-50 rounded-md p-3 text-xs text-gray-700 leading-relaxed">
                              <span className="font-medium text-gray-500 block mb-1">
                                Requested changes
                              </span>
                              {req.changes}
                            </div>
                          )}
                          {req.request_type === 'delete' && req.reason && (
                            <div className="bg-gray-50 rounded-md p-3 text-xs text-gray-700 leading-relaxed">
                              <span className="font-medium text-gray-500 block mb-1">
                                Reason
                              </span>
                              {req.reason}
                            </div>
                          )}
                          <div className="text-xs text-gray-400 mt-3">
                            Submitted {req.submitted_at}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() =>
                              setRequests(
                                requests.map((r) =>
                                  r.id === req.id ? { ...r, status: 'approved' } : r
                                )
                              )
                            }
                            className="px-3.5 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                          >
                            Done
                          </button>
                          <button
                            onClick={() =>
                              setRequests(
                                requests.map((r) =>
                                  r.id === req.id ? { ...r, status: 'dismissed' } : r
                                )
                              )
                            }
                            className="px-3.5 py-1.5 border border-gray-300 text-gray-600 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )
          ) : activeTab === 'pending' ? (
            pending.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-gray-200 text-5xl mb-4">✓</div>
                <div className="text-gray-400 text-sm">No pending submissions</div>
              </div>
            ) : (
              <div className="space-y-3 max-w-3xl">
                {pending.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600 flex-shrink-0">
                            {getInitials(item.first_name, item.last_name)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.first_name} {item.last_name}
                            </div>
                            <div className="text-sm text-gray-600 mt-0.5">
                              {item.role} · {item.organisation}
                            </div>
                          </div>
                        </div>
                        {item.bio && (
                          <p className="text-sm text-gray-600 mt-4 leading-relaxed">
                            {item.bio}
                          </p>
                        )}
                        {item.expertise && (
                          <div className="flex gap-2 mt-3">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                              {item.expertise}
                            </span>
                          </div>
                        )}
                        <div className="text-xs text-gray-400 mt-3">
                          {item.editor_email}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0 pt-1">
                        <button
                          onClick={() => handleAction(item.id, 'approve')}
                          disabled={actionId === item.id}
                          className="px-3.5 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                          {actionId === item.id ? '...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleAction(item.id, 'reject')}
                          disabled={actionId === item.id}
                          className="px-3.5 py-1.5 border border-gray-300 text-gray-600 text-sm font-medium rounded-full hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Name</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Role</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Organisation</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Featured</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {all.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 flex-shrink-0">
                            {getInitials(item.first_name, item.last_name)}
                          </div>
                          <span className="text-sm text-gray-900 font-medium">
                            {item.first_name} {item.last_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{item.role}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{item.organisation}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            item.status === 'live'
                              ? 'bg-gray-200 text-gray-700'
                              : item.status === 'pending'
                                ? 'bg-gray-100 text-gray-500'
                                : 'bg-gray-50 text-gray-400'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {item.featured ? (
                          <span className="text-xs text-gray-900">★</span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
