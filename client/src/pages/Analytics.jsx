import React, { useMemo, useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { MOCK_LEADERS } from '../data/mockData'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

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

export default function Analytics({ onManageProfile }) {
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

  const countryCounts = useMemo(() => {
    const counts = {}
    MOCK_LEADERS.forEach((m) => {
      if (m.country) counts[m.country] = (counts[m.country] || 0) + 1
    })
    return counts
  }, [])

  function countryFill(count) {
    if (count >= 3) return '#374151'
    if (count === 2) return '#6b7280'
    return '#9ca3af'
  }

  const markerData = useMemo(() => {
    const regionTotals = {}
    MOCK_LEADERS.forEach((m) => {
      const r = m.region
      if (r) regionTotals[r] = (regionTotals[r] || 0) + 1
    })
    return [
      { name: 'N. America',    coordinates: [-100, 42], r: 5, count: regionTotals['north_america']    || 0 },
      { name: 'Europe',        coordinates: [15,  52],  r: 5, count: regionTotals['europe']           || 0 },
      { name: 'Africa',        coordinates: [22,   5],  r: 7, count: regionTotals['africa']           || 0 },
      { name: 'S. Asia',       coordinates: [80,  22],  r: 5, count: regionTotals['south_asia']       || 0 },
      { name: 'Latin America', coordinates: [-55, -10], r: 4, count: regionTotals['latin_america']    || 0 },
    ].filter((m) => m.count > 0)
  }, [])

  function shortLabel(name) {
    return name
      .replace('Digital health ', 'DH ')
      .replace('Health systems ', 'H. systems ')
      .replace('strengthening', 'strength.')
  }

  return (
    <div className="min-h-screen" style={{ background: 'rgb(255, 255, 244)' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Key Highlights from the Database
          </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-xl leading-relaxed">
            Overview of expertise distribution, demographic representation, and leadership density across the network.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Geographic Density
            </div>
            <div className="text-xs text-gray-500 mt-1 mb-4">
              Global distribution of network nodes.
            </div>

            <div className="bg-gray-100 rounded-md" style={{ height: 360 }}>
              <ComposableMap
                projectionConfig={{ scale: 147, center: [10, 10] }}
                width={800}
                height={400}
                style={{ width: '100%', height: '100%' }}
              >
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const count = countryCounts[geo.properties.name] || 0
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={count > 0 ? countryFill(count) : '#d1d5db'}
                          stroke="#fff"
                          strokeWidth={0.4}
                          style={{
                            default: { outline: 'none' },
                            hover: { outline: 'none', opacity: 0.75 },
                            pressed: { outline: 'none' },
                          }}
                        />
                      )
                    })
                  }
                </Geographies>
                {markerData.map((m) => (
                  <Marker key={m.name} coordinates={m.coordinates}>
                    <circle r={m.r} fill="#18181b" opacity={0.85} stroke="#fff" strokeWidth={1} />
                    <text
                      textAnchor="middle"
                      y={-m.r - 3}
                      style={{ fontSize: 5, fontWeight: 700, fill: '#18181b', fontFamily: 'system-ui' }}
                    >
                      {m.name} ({m.count})
                    </text>
                  </Marker>
                ))}
              </ComposableMap>
            </div>

            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
                <div className="w-3 h-3 rounded-sm bg-gray-300" /> No members yet
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
                <div className="w-3 h-3 rounded-sm bg-gray-500" /> 1–2 members
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
                <div className="w-3 h-3 rounded-sm bg-gray-800" /> 3+ members
              </div>
            </div>
          </div>

           <div className="bg-white border border-gray-200 rounded-lg p-6">
             <div className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">
               Specialisation
             </div>
             <div className="text-xs text-gray-500 mt-1 mb-4">
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

      <div style={{ textAlign: 'center', padding: '24px 0 32px', fontFamily: "'Montserrat', sans-serif" }}>
        <p style={{ fontSize: 13, color: '#666' }}>
          Already in the database?{' '}
          <button
            onClick={() => onManageProfile(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#02598e', fontWeight: 600, fontSize: 13, textDecoration: 'underline', padding: 0 }}
          >
            Manage or remove your profile
          </button>
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
