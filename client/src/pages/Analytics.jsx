import React, { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Annotation,
} from "react-simple-maps";
import { MOCK_LEADERS } from "../data/mockData";

const REGION_LABELS = {
  north_america: "North America",
  latin_america: "Latin America",
  europe: "Europe",
  sub_saharan_africa: "Sub-Saharan Africa",
  south_asia: "South & SE Asia",
};

const REGION_MARKERS = [
  {
    key: "north_america",
    coordinates: [-95, 40],
    dx: -105,
    dy: -90,
  },
  {
    key: "latin_america",
    coordinates: [-55, -10],
    dx: -55,
    dy: 80,
  },
  {
    key: "europe",
    coordinates: [10, 50],
    dx: 75,
    dy: -85,
  },
  {
    key: "sub_saharan_africa",
    coordinates: [20, 5],
    dx: 60,
    dy: 55,
  },
  {
    key: "south_asia",
    coordinates: [80, 20],
    dx: 85,
    dy: -55,
  },
];

const COUNTRY_TO_REGION = {
  "United States": "north_america",
  Canada: "north_america",
  Mexico: "north_america",
  Brazil: "latin_america",
  Argentina: "latin_america",
  Colombia: "latin_america",
  Peru: "latin_america",
  Chile: "latin_america",
  France: "europe",
  "United Kingdom": "europe",
  Germany: "europe",
  Switzerland: "europe",
  Spain: "europe",
  Italy: "europe",
  Netherlands: "europe",
  "South Africa": "sub_saharan_africa",
  Nigeria: "sub_saharan_africa",
  Kenya: "sub_saharan_africa",
  Tanzania: "sub_saharan_africa",
  Uganda: "sub_saharan_africa",
  Ghana: "sub_saharan_africa",
  Ethiopia: "sub_saharan_africa",
  Rwanda: "sub_saharan_africa",
  Senegal: "sub_saharan_africa",
  India: "south_asia",
  Pakistan: "south_asia",
  Bangladesh: "south_asia",
  "Sri Lanka": "south_asia",
  Nepal: "south_asia",
  Bhutan: "south_asia",
};

function TBC() {
  return <span className="text-gray-600 italic text-[1.4rem]">TBC</span>;
}

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const BAR_COLORS = [
  "#F97316",
  "#18181B",
  "#1E3A5F",
  "#EAB308",
  "#22C55E",
  "#38BDF8",
  "#EC4899",
  "#166534",
];

const FEATURED_IDS = ["th_38", "th_46", "th_52", "th_80"];

function getInitials(first, last) {
  return ((first?.[0] || "") + (last?.[0] || "")).toUpperCase();
}

function toTitleCase(str) {
  return str.replace(/\b\w+/g, (word) => {
    if (word.toUpperCase() === "AI") return "AI";
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

export default function Analytics({ onManageProfile, onGoToDirectory }) {
  const stats = useMemo(() => {
    const expertiseCounts = {};
    const orgSet = new Set();
    MOCK_LEADERS.forEach((it) => {
      const exp = it.expertise || "Other";
      expertiseCounts[exp] = (expertiseCounts[exp] || 0) + 1;
      if (it.organisation) orgSet.add(it.organisation);
    });
    return {
      total: MOCK_LEADERS.length,
      expertise: Object.keys(expertiseCounts).length,
      orgs: orgSet.size,
      expertiseCounts,
    };
  }, []);

  const barData = useMemo(() => {
    const entries = Object.entries(stats.expertiseCounts)
      .filter(([name]) => !name.includes(","))
      .sort((a, b) => b[1] - a[1]);
    const max = entries[0]?.[1] || 1;
    return entries.map(([name, count], i) => ({
      name,
      count,
      barPct: Math.round((count / max) * 100),
      color: BAR_COLORS[i % BAR_COLORS.length],
    }));
  }, [stats]);

  const featured = useMemo(() => {
    const featuredLeaders = MOCK_LEADERS.filter((l) =>
      FEATURED_IDS.includes(l.id)
    ).filter(Boolean);
    const shuffled = [...featuredLeaders].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, []);

  const [selectedRegion, setSelectedRegion] = useState("latin_america");

  const countryCounts = useMemo(() => {
    const counts = {};
    MOCK_LEADERS.forEach((m) => {
      if (m.country) counts[m.country] = (counts[m.country] || 0) + 1;
    });
    return counts;
  }, []);

  const countryRegionMap = useMemo(() => {
    const map = {};
    Object.keys(countryCounts).forEach((countryName) => {
      const regionKey = COUNTRY_TO_REGION[countryName];
      if (regionKey) map[countryName] = regionKey;
    });
    return map;
  }, [countryCounts]);

  const regionTotals = useMemo(() => {
    const totals = {
      north_america: 0,
      latin_america: 0,
      europe: 0,
      sub_saharan_africa: 0,
      south_asia: 0,
    };
    MOCK_LEADERS.forEach((m) => {
      const countryName = m.country?.trim();
      const regionKey = m.region || COUNTRY_TO_REGION[countryName];
      if (regionKey) totals[regionKey] = (totals[regionKey] || 0) + 1;
    });
    return totals;
  }, []);

  function countryFill(count) {
    if (count >= 3) return "#374151";
    if (count === 2) return "#6b7280";
    return "#9ca3af";
  }

  const markerData = useMemo(() => {
    const regionTotals = {};
    MOCK_LEADERS.forEach((m) => {
      const r = m.region;
      if (r) regionTotals[r] = (regionTotals[r] || 0) + 1;
    });
    return [
      {
        name: "N. America",
        coordinates: [-100, 42],
        r: 5,
        count: regionTotals["north_america"] || 0,
      },
      {
        name: "Europe",
        coordinates: [15, 52],
        r: 5,
        count: regionTotals["europe"] || 0,
      },
      {
        name: "Africa",
        coordinates: [22, 5],
        r: 7,
        count: regionTotals["africa"] || 0,
      },
      {
        name: "S. Asia",
        coordinates: [80, 22],
        r: 5,
        count: regionTotals["south_asia"] || 0,
      },
      {
        name: "Latin America",
        coordinates: [-55, -10],
        r: 4,
        count: regionTotals["latin_america"] || 0,
      },
    ].filter((m) => m.count > 0);
  }, []);

  function shortLabel(name) {
    return name
      .replace("Digital health ", "DH ")
      .replace("Health systems ", "H. systems ")
      .replace("strengthening", "strength.");
  }

  return (
    <div className="min-h-screen" style={{ background: "#f5efe0" }}>
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="mb-8">
          <h2
            className="text-[3rem] font-bold text-gray-900 tracking-tight"
            style={{ letterSpacing: "-0.042em" }}
          >
            Key Highlights from the Database
          </h2>
          <p className="text-[1.6rem] text-gray-600 mt-2 leading-relaxed">
            Overview of expertise distribution, demographic representation, and leadership density across the network.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8 items-start">
          <div className="lg:col-span-3" style={{ backgroundColor: "transparent" }}>
            <ComposableMap
              projectionConfig={{ scale: 215, center: [-18, 2] }}
              width={900}
              height={520}
              style={{ width: "100%", height: "auto", backgroundColor: "transparent" }}
            >
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const countryName = geo.properties.name;
                      const regionKey = countryRegionMap[countryName];
                      const fill = regionKey === selectedRegion ? "#F97A1A" : "#D4D4D8";
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={fill}
                          stroke="#FFFFFF"
                          strokeWidth={0.7}
                          style={{
                            default: { outline: "none" },
                            hover: { outline: "none", opacity: 0.85 },
                            pressed: { outline: "none" },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
                {REGION_MARKERS.map((marker) => {
                  if (marker.key !== selectedRegion) return null;
                  const count = regionTotals[marker.key] || 0;
                  if (!count) return null;
                  return (
                    <Annotation
                      key={marker.key}
                      subject={marker.coordinates}
                      dx={marker.dx}
                      dy={marker.dy}
                      connectorProps={{
                        stroke: "#F8571D",
                        strokeWidth: 1.5,
                        strokeLinecap: "round",
                      }}
                    >
                      <g>
                        <rect
                          x="-62"
                          y="-26"
                          width="124"
                          height="48"
                          rx="10"
                          fill="#F8571D"
                        />
                        <text
                          textAnchor="middle"
                          y="-8"
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            fill: "#ffffff",
                            fontFamily: "system-ui",
                          }}
                        >
                          {REGION_LABELS[marker.key]}
                        </text>
                        <text
                          textAnchor="middle"
                          y="11"
                          style={{
                            fontSize: 11,
                            fill: "#ffffff",
                            fontFamily: "system-ui",
                          }}
                        >
                          {count} Leaders
                        </text>
                      </g>
                    </Annotation>
                  );
                })}
              </ComposableMap>

            <div className="relative mt-5">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
                <div className="h-px border-t border-dashed border-[#F97A1A] opacity-50" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative z-10">
                {REGION_MARKERS.map((region) => (
                  <button
                    key={region.key}
                    type="button"
                    onClick={() => setSelectedRegion(region.key)}
                    className="flex flex-col items-center gap-2 text-center py-3"
                  >
                    <span
                      className={`text-[1.1rem] font-semibold transition-colors ${
                        selectedRegion === region.key
                          ? "text-[#F8571D]"
                          : "text-[#334155]"
                      }`}
                    >
                      {REGION_LABELS[region.key]}
                    </span>
                    <span
                      className={`w-3.5 h-3.5 rounded-full transition-colors ${
                        selectedRegion === region.key
                          ? "bg-[#F8571D]"
                          : "bg-[#F97A1A]/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 flex flex-col">
            <div className="text-[1.2rem] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Specialisation
            </div>
            <div
              className="text-[1.8rem] font-bold leading-snug mb-4"
              style={{ color: "#24588A" }}
            >
              Based on the {stats.total} verified profiles
            </div>

            <div className="flex-1 space-y-3">
              {barData.map((d) => (
                <div key={d.name}>
                  <div className="flex justify-between items-baseline text-[1.35rem] mb-1">
                    <span className="font-medium text-gray-800">{toTitleCase(d.name)}</span>
                    <span className="font-bold text-gray-900 flex-shrink-0 ml-3">{d.count}</span>
                  </div>
                  <div className="h-[5px] bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${d.barPct}%`, backgroundColor: d.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6 relative z-10">
            <div>
              <div
                className="text-[2.4rem] font-bold tracking-tight"
                style={{ letterSpacing: "-0.042em", color: "#24588A" }}
              >
                Emerging Voices in Practice
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => onGoToDirectory?.()}
                className="px-6 py-3 bg-[#E8571D] text-white rounded-lg text-[1.6rem] font-medium hover:bg-[#d64d1f] transition-colors"
              >
                View Directory
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {featured.map((l) => {
              const expertiseTags = (l.expertise || "")
                .split(/,\s*/)
                .filter(Boolean);
              return (
                <div
                  key={l.id}
                  className="relative cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                  style={{ border: "1px solid #e5e7eb" }}
                >
                  {/* Card top SVG header */}
                  <img
                    src="./illustrations/Card-top.svg"
                    alt="Card top illustration"
                    className="w-full h-[120px] object-cover"
                  />

                  {/* Profile photo — straddles header/body boundary */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{ top: 60, zIndex: 2 }}
                  >
                    <div className="relative">
                      {l.photo_url ? (
                        <img
                          src={l.photo_url}
                          alt={`${l.first_name} ${l.last_name}`}
                          className="w-[76px] h-[76px] rounded-full object-cover"
                          style={{ border: "2px solid #F85A8E" }}
                        />
                      ) : (
                        <div
                          className="w-[76px] h-[76px] rounded-full bg-[#D9D9D9] flex items-center justify-center text-[2rem] font-semibold text-gray-600"
                          style={{ border: "2px solid #F85A8E" }}
                        >
                          {getInitials(l.first_name, l.last_name)}
                        </div>
                      )}
                      {l.linkedin?.trim() && (
                        <a
                          href={l.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="absolute bottom-0 right-[-4px] w-[28px] h-[28px] rounded-full bg-[#02598E] flex items-center justify-center hover:bg-[#024a75] transition-colors"
                          aria-label="LinkedIn"
                          title="Open LinkedIn profile"
                        >
                          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                            <path d="M10.5 5.5C11.563 5.5 12.583 5.921 13.334 6.672C14.085 7.423 14.5 8.437 14.5 9.5V14H12.5V9.5C12.5 8.97 12.289 8.461 11.914 8.086C11.539 7.711 11.03 7.5 10.5 7.5C9.97 7.5 9.461 7.711 9.086 8.086C8.711 8.461 8.5 8.97 8.5 9.5V14H6.5V9.5C6.5 8.437 6.915 7.423 7.666 6.672C8.417 5.921 9.437 5.5 10.5 5.5Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M1.5 6H4.5V14H1.5V6Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="3" cy="3" r="1.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* White body */}
                  <div
                    className="bg-white flex flex-col"
                    style={{ paddingTop: 52, paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}
                  >
                    {/* Name + role + org */}
                    <div className="text-center mb-3">
                      <div className="font-semibold text-gray-900 text-[1.6rem] leading-tight">
                        {l.first_name} {l.last_name}
                      </div>
                      <div className="text-[1.3rem] text-gray-500 mt-1 leading-snug">
                        {l.role || <TBC />}
                      </div>
                      {l.organisation && (
                        <div className="text-[1.2rem] text-gray-400 mt-0.5">{l.organisation}</div>
                      )}
                    </div>

                    {/* Expertise tags */}
                    {l.expertise && (
                      <div className="flex flex-wrap gap-1 justify-center mb-4">
                        {expertiseTags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[1.2rem] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {expertiseTags.length > 3 && (
                          <span className="text-[1.2rem] text-gray-500">
                            +{expertiseTags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer: country + read more */}
                    <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                      {l.country ? (
                        <span className="text-[1.2rem] text-gray-400">{l.country}</span>
                      ) : (
                        <span />
                      )}
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 w-[134px] h-[40px] bg-[#F85A8E] rounded-[20px] text-white text-[1.3rem] font-medium flex-none order-2"
                      >
                        Read more →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-center text-[1.1rem] text-gray-600 mt-6">
          Data sourced from the Transform Health Women Leaders Database ·{" "}
          {stats.total} verified profiles
        </p>
      </div>

      <div
        style={{
          textAlign: "center",
          padding: "2.4rem 0 3.2rem",
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        <p style={{ fontSize: "1.4rem", color: "#555" }}>
          Already in the database?{" "}
          <button
            onClick={() => onManageProfile(null)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#02598e",
              fontWeight: 600,
              fontSize: "1.4rem",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            Manage or remove your profile
          </button>
        </p>
      </div>
    </div>
  );
}
