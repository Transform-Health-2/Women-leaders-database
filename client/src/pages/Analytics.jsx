import React, { useMemo, useState } from 'react'
import { MOCK_LEADERS } from '../data/mockData'

const EXPERTISE_ORDER = [
  'Health systems strengthening',
  'Digital health strategy',
  'Digital health innovation',
  'Digital health policy',
  'Digital health advocacy',
  'AI',
  'Health information systems',
  'Health financing',
  'Digital health',
  'Research',
  'Digital health philanthropy',
  'Digital health transformation',
  'Health workforce',
]

const GRAYS = [
  '#18181b',
  '#27272a',
  '#3f3f46',
  '#52525b',
  '#71717a',
  '#a1a1aa',
  '#d4d4d8',
  '#e4e4e7',
  '#f4f4f5',
]

const FEATURED_IDS = ['th_38', 'th_46', 'th_52', 'th_80']

function getInitials(first, last) {
  return ((first?.[0] || '') + (last?.[0] || '')).toUpperCase()
}

export default function Analytics() {
  const [selectedRegion, setSelectedRegion] = useState('Global')
  const [modalLeader, setModalLeader] = useState(null)

  const stats = useMemo(() => {
    const expertiseCounts = {}
    const orgSet = new Set()
    MOCK_LEADERS.forEach((it) => {
      const exp = it.expertise || 'Other'
      expertiseCounts[exp] = (expertiseCounts[exp] || 0) + 1
      if (it.organisation) orgSet.add(it.organisation)
    })
    return {
      total: MOCK_LEADERS.length,
      expertise: Object.keys(expertiseCounts).length,
      orgs: orgSet.size,
      expertiseCounts,
    }
  }, [])

  const barData = useMemo(() => {
    const entries = Object.entries(stats.expertiseCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
    const max = entries[0]?.[1] || 1
    return entries.map(([name, count], i) => ({
      name,
      count,
      pct: Math.round((count / stats.total) * 100),
      barPct: Math.round((count / max) * 100),
      color: GRAYS[2 + (i % (GRAYS.length - 4))],
    }))
  }, [stats])

  const featured = useMemo(() => {
    return MOCK_LEADERS.filter((l) => FEATURED_IDS.includes(l.id)).filter(Boolean)
  }, [])

  const regions = ['Global', 'Africa', 'Europe', 'Americas', 'Asia-Pacific']

  function shortLabel(name) {
    return name
      .replace('Digital health ', 'DH ')
      .replace('Health systems ', 'H. systems ')
      .replace('strengthening', 'strength.')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-3 gap-4 py-8">
          <div className="text-center">
            <div className="text-5xl font-bold tracking-tight">{stats.total}</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-2">
              Verified Members
            </div>
            <div className="text-xs text-gray-500 mt-1">Women health leaders, global network</div>
          </div>
          <div className="text-center border-x border-gray-700">
            <div className="text-5xl font-bold tracking-tight">{stats.expertise}</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-2">
              Specialisations
            </div>
            <div className="text-xs text-gray-500 mt-1">Across 8 core domains</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold tracking-tight">{stats.orgs}+</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-2">
              Organisations
            </div>
            <div className="text-xs text-gray-500 mt-1">WHO, World Bank, Gates Foundation & more</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Global Equity Landscape
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-xl leading-relaxed">
            Real-time visualisation of expertise distribution, demographic representation, and leadership density across the network.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Geographic Density
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Global distribution of network nodes.
            </div>

            <div className="flex gap-2 mt-4 mb-4">
              {regions.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    selectedRegion === r
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="relative bg-gray-100 rounded-md overflow-hidden min-h-[320px]">
              <svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
                <rect width="1000" height="500" fill="#e5e7eb" />
                <line x1="0" y1="250" x2="1000" y2="250" stroke="#d1d5db" strokeWidth="0.8" strokeDasharray="5,8" opacity="0.7" />
                <path d="M 41,83 L 64,53 L 152,47 L 263,19 L 305,47 L 352,103 L 325,125 L 294,136 L 285,150 L 278,164 L 278,181 L 258,194 L 250,197 L 247,214 L 236,219 L 219,214 L 203,203 L 194,186 L 167,150 L 155,117 L 125,92 L 83,83 Z" fill="#d1d5db" stroke="#9ca3af" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M 275,233 L 311,219 L 328,219 L 403,264 L 411,275 L 395,306 L 342,356 L 311,403 L 283,361 L 258,303 L 278,264 L 278,250 Z" fill="#d1d5db" stroke="#9ca3af" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M 472,150 L 486,153 L 500,136 L 519,131 L 544,144 L 561,153 L 575,136 L 608,125 L 589,108 L 583,83 L 592,58 L 581,56 L 542,56 L 514,89 L 528,94 L 517,103 L 486,111 Z" fill="#d1d5db" stroke="#9ca3af" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M 483,150 L 531,147 L 589,164 L 594,172 L 622,219 L 642,219 L 617,253 L 611,269 L 600,303 L 592,328 L 553,344 L 544,331 L 533,297 L 525,253 L 514,236 L 497,236 L 486,236 L 472,222 L 458,211 L 453,192 L 461,172 Z" fill="#d1d5db" stroke="#9ca3af" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M 608,125 L 606,67 L 667,69 L 731,47 L 783,39 L 950,56 L 953,94 L 936,167 L 836,167 L 817,189 L 803,219 L 778,236 L 775,211 L 750,189 L 686,181 L 675,181 L 661,189 L 647,197 L 625,214 L 608,192 L 597,169 L 631,164 L 608,147 Z" fill="#d1d5db" stroke="#9ca3af" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M 817,311 L 864,281 L 903,281 L 928,325 L 922,347 L 883,353 L 817,347 Z" fill="#d1d5db" stroke="#9ca3af" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>

              <div className="absolute w-36 h-36 rounded-full bg-gray-400 opacity-10 blur-3xl top-[20%] left-[14%] pointer-events-none" />
              <div className="absolute w-44 h-44 rounded-full bg-gray-600 opacity-10 blur-3xl top-[30%] right-[20%] pointer-events-none" />
              <div className="absolute w-32 h-32 rounded-full bg-gray-500 opacity-10 blur-3xl bottom-[15%] left-[40%] pointer-events-none" />

              <div className="absolute top-[30%] left-[19%] cursor-pointer group">
                <div className="w-3.5 h-3.5 rounded-full bg-gray-800 border-2 border-white shadow-md relative z-10" />
                <div className="absolute -inset-1.5 rounded-full bg-gray-800 opacity-30 animate-ping" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  North America · 23 leaders
                </div>
              </div>

              <div className="absolute top-[24%] left-[46%] cursor-pointer group">
                <div className="w-4 h-4 rounded-full bg-gray-600 border-2 border-white shadow-md relative z-10" />
                <div className="absolute -inset-1.5 rounded-full bg-gray-600 opacity-30 animate-ping" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Europe · 18 leaders
                </div>
              </div>

              <div className="absolute top-[50%] left-[47%] cursor-pointer group">
                <div className="w-4 h-4 rounded-full bg-gray-800 border-2 border-white shadow-md relative z-10" />
                <div className="absolute -inset-1.5 rounded-full bg-gray-800 opacity-30 animate-ping" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Sub-Saharan Africa · 27 leaders
                </div>
              </div>

              <div className="absolute top-[40%] left-[64%] cursor-pointer group">
                <div className="w-3.5 h-3.5 rounded-full bg-gray-500 border-2 border-white shadow-md relative z-10" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  South & SE Asia · 8 leaders
                </div>
              </div>

              <div className="absolute top-[58%] left-[26%] cursor-pointer group">
                <div className="w-3.5 h-3.5 rounded-full bg-gray-400 border-2 border-white shadow-md relative z-10" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Latin America · 5 leaders
                </div>
              </div>

              <div className="absolute bottom-3 left-3 flex gap-3 z-10">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-800" />
                  High density
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                  Mid density
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                  Emerging
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Expertise Concentration
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Based on {stats.total} verified profiles.
            </div>

            <div className="mt-5">
              {barData.map((d) => (
                <div key={d.name} className="mb-4 last:mb-0">
                  <div className="flex justify-between text-xs font-semibold text-gray-800 mb-1">
                    <span className="truncate pr-3">{shortLabel(d.name)}</span>
                    <span className="text-gray-900 flex-shrink-0">
                      {d.count}{' '}
                      <span className="text-gray-400 font-normal">({d.pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${d.barPct}%`, backgroundColor: d.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-5 py-2 border border-dashed border-gray-300 rounded-full text-xs font-semibold text-gray-500 uppercase tracking-wider hover:border-gray-400 transition-colors">
              View Full Taxonomy
            </button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-8 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-gray-700 opacity-40 blur-3xl pointer-events-none" />

          <div className="flex items-end justify-between gap-6 mb-6 relative z-10">
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">
                Emerging Voices in Practice
              </div>
              <div className="text-xs text-gray-400 mt-1.5 max-w-lg leading-relaxed">
                Dynamic leaders driving localised equity initiatives across our global network.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {featured.map((l) => (
              <div
                key={l.id}
                onClick={() => setModalLeader(l)}
                className="bg-white/10 border border-white/20 rounded-lg p-5 backdrop-blur-sm cursor-pointer hover:-translate-y-1 transition-transform"
              >
                <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center text-sm font-bold text-white mb-4">
                  {getInitials(l.first_name, l.last_name)}
                </div>
                <div className="text-sm font-bold text-white leading-tight">
                  {l.first_name} {l.last_name}
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mt-1">
                  {l.role}
                </div>
                <div className="text-xs text-gray-300 mt-3 leading-relaxed line-clamp-3">
                  {l.organisation}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className="text-[10px] bg-white/15 text-gray-200 rounded-full px-2 py-0.5 font-semibold">
                    {l.expertise}
                  </span>
                </div>
                {l.linkedin && (
                  <a
                    href={l.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mt-3 inline-flex items-center gap-1 hover:text-gray-200 transition-colors"
                  >
                    LinkedIn ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-6">
          Data sourced from the Transform Health Women Leaders Database · {stats.total} verified profiles
        </p>
      </div>

      {modalLeader && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-6"
          onClick={() => setModalLeader(null)}
        >
          <div
            className="bg-white rounded-lg border border-gray-200 p-7 max-w-sm w-full shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalLeader(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm text-gray-500 hover:bg-gray-200 transition-colors"
            >
              ×
            </button>

            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
              Featured Leader
            </div>

            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {getInitials(modalLeader.first_name, modalLeader.last_name)}
              </div>
              <div>
                <div className="text-base font-bold text-gray-900 leading-tight">
                  {modalLeader.first_name} {modalLeader.last_name}
                </div>
                <div className="text-sm text-gray-600 mt-0.5">{modalLeader.role}</div>
                <div className="text-sm text-gray-500 mt-0.5">{modalLeader.organisation}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-1 font-semibold">
                {modalLeader.expertise}
              </span>
            </div>

            {modalLeader.linkedin && (
              <a
                href={modalLeader.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-gray-900 font-semibold inline-flex items-center gap-1 transition-colors"
              >
                View LinkedIn Profile ↗
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
