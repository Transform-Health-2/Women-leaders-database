import React, { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Annotation,
} from "react-simple-maps";
import { useLeaders } from "../hooks/useLeaders";
import LeaderCard from "../components/LeaderCard";

const REGION_LABELS = {
  north_america:    "North America",
  latin_america:    "Latin America",
  europe:           "Europe",
  sub_saharan_africa: "Sub-Saharan Africa",
  south_asia:       "South & SE Asia",
};

const REGION_MARKERS = [
  { key: "north_america",     coordinates: [-95, 40],  dx: -105, dy: -90 },
  { key: "latin_america",     coordinates: [-55, -10], dx: -55,  dy: 80  },
  { key: "europe",            coordinates: [10, 50],   dx: 60,   dy: 80  },
  { key: "sub_saharan_africa",coordinates: [20, 5],    dx: 60,   dy: 55  },
  { key: "south_asia",        coordinates: [80, 20],   dx: 85,   dy: -55 },
];

const COUNTRY_TO_REGION = {
  "United States": "north_america", Canada: "north_america", Mexico: "north_america",
  Brazil: "latin_america", Argentina: "latin_america", Colombia: "latin_america",
  Peru: "latin_america", Chile: "latin_america",
  France: "europe", "United Kingdom": "europe", Germany: "europe",
  Switzerland: "europe", Spain: "europe", Italy: "europe", Netherlands: "europe",
  "South Africa": "sub_saharan_africa", Nigeria: "sub_saharan_africa",
  Kenya: "sub_saharan_africa", Tanzania: "sub_saharan_africa",
  Uganda: "sub_saharan_africa", Ghana: "sub_saharan_africa",
  Ethiopia: "sub_saharan_africa", Rwanda: "sub_saharan_africa", Senegal: "sub_saharan_africa",
  India: "south_asia", Pakistan: "south_asia", Bangladesh: "south_asia",
  "Sri Lanka": "south_asia", Nepal: "south_asia", Bhutan: "south_asia",
};

const BAR_COLORS = ["#F97316","#18181B","#1E3A5F","#EAB308","#22C55E","#38BDF8","#EC4899","#166534"];

const FEATURED_IDS = ["th_38", "th_46", "th_52", "th_80"];

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function toTitleCase(str) {
  return str.replace(/\b\w+/g, (word) => {
    if (word.toUpperCase() === "AI") return "AI";
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

export default function Analytics({ onManageProfile, onGoToDirectory }) {
  const [selectedRegion, setSelectedRegion] = useState("latin_america");

  const { allLeaders, loading } = useLeaders();

  const stats = useMemo(() => {
    const expertiseCounts = {};
    const orgSet = new Set();
    allLeaders.forEach((l) => {
      const exp = l.expertise || "Other";
      expertiseCounts[exp] = (expertiseCounts[exp] || 0) + 1;
      if (l.organisation) orgSet.add(l.organisation);
    });
    return { total: allLeaders.length, expertiseCounts, orgs: orgSet.size };
  }, [allLeaders]);

  const barData = useMemo(() => {
    const entries = Object.entries(stats.expertiseCounts)
      .filter(([name]) => !name.includes(","))
      .sort((a, b) => b[1] - a[1]);
    const max = entries[0]?.[1] || 1;
    return entries.map(([name, count], i) => ({
      name, count,
      barPct: Math.round((count / max) * 100),
      color: BAR_COLORS[i % BAR_COLORS.length],
    }));
  }, [stats]);

  const featured = useMemo(() => {
    const picked = allLeaders.filter((l) => FEATURED_IDS.includes(l.id));
    return [...picked].sort(() => Math.random() - 0.5).slice(0, 3);
  }, [allLeaders]);

  const countryRegionMap = useMemo(() => {
    const map = {};
    allLeaders.forEach((l) => {
      if (l.country && COUNTRY_TO_REGION[l.country]) {
        map[l.country] = COUNTRY_TO_REGION[l.country];
      }
    });
    return map;
  }, [allLeaders]);

  const regionTotals = useMemo(() => {
    const totals = { north_america: 0, latin_america: 0, europe: 0, sub_saharan_africa: 0, south_asia: 0 };
    allLeaders.forEach((l) => {
      const key = l.region || COUNTRY_TO_REGION[l.country?.trim()];
      if (key && key in totals) totals[key]++;
    });
    return totals;
  }, [allLeaders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-sand flex items-center justify-center">
        <div className="text-gray-600 text-[1.8rem]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-sand">
      <div className="max-w-[1440px] mx-auto px-8 py-8">

        {/* Section heading */}
        <div className="mb-8">
          <h2 className="text-[3rem] font-bold text-gray-900 tracking-heading">
            Key Highlights from the Database
          </h2>
          <p className="text-1.6 text-gray-600 mt-2 leading-relaxed">
            Overview of expertise distribution, demographic representation, and leadership density across the network.
          </p>
        </div>

        {/* Map + Specialisation */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8 items-stretch">

          {/* Map column */}
          <div className="lg:col-span-3 flex flex-col bg-transparent">
            <ComposableMap
              projectionConfig={{ scale: 215, center: [5, 5] }}
              width={900}
              height={520}
              style={{ width: "100%", height: "auto", backgroundColor: "transparent" }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const regionKey = countryRegionMap[geo.properties.name];
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={regionKey === selectedRegion ? "#F97A1A" : "#D4D4D8"}
                        stroke="#FFFFFF"
                        strokeWidth={0.7}
                        style={{
                          default: { outline: "none" },
                          hover:   { outline: "none", opacity: 0.85 },
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
                    connectorProps={{ stroke: "#F8571D", strokeWidth: 1.5, strokeLinecap: "round" }}
                  >
                    <g>
                      <rect x="-62" y="-26" width="124" height="48" rx="10" fill="#F8571D" />
                      {/* SVG text styles must stay inline — Tailwind cannot target SVG text elements */}
                      <text textAnchor="middle" y="-8" style={{ fontSize: 13, fontWeight: 700, fill: "#ffffff", fontFamily: "system-ui" }}>
                        {REGION_LABELS[marker.key]}
                      </text>
                      <text textAnchor="middle" y="11" style={{ fontSize: 11, fill: "#ffffff", fontFamily: "system-ui" }}>
                        {count} Leaders
                      </text>
                    </g>
                  </Annotation>
                );
              })}
            </ComposableMap>

            {/* Region selector */}
            <div className="relative mt-auto pt-5">
              <p className="text-center text-1.1 text-gray-400 mb-3 tracking-wide uppercase">
                Select a region to explore
              </p>
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
                <div className="h-px border-t border-dashed border-brand-orange-light opacity-50" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative z-10">
                {REGION_MARKERS.map((region) => (
                  <button
                    key={region.key}
                    type="button"
                    onClick={() => setSelectedRegion(region.key)}
                    className="flex flex-col items-center gap-1 text-center py-3 px-2 rounded-lg hover:bg-brand-orange-light/10 transition-colors cursor-pointer"
                  >
                    <span className={`text-1.1 font-semibold transition-colors ${selectedRegion === region.key ? "text-brand-orange" : "text-gray-700"}`}>
                      {REGION_LABELS[region.key]}
                    </span>
                    <span className="text-[1rem] text-gray-400">
                      {regionTotals[region.key] || 0} leaders
                    </span>
                    <span className={`w-3.5 h-3.5 rounded-full transition-colors ${selectedRegion === region.key ? "bg-brand-orange" : "bg-brand-orange-light/30"}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Specialisation sidebar */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 flex flex-col">
            <div className="text-1.2 font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Specialisation
            </div>
            <div className="text-[1.8rem] font-bold leading-snug mb-4 text-brand-blue">
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
                    {/* width is a dynamic value — inline style required here */}
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

        {/* Emerging Voices */}
        <div className="p-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
            <div className="text-2.4 font-bold tracking-heading text-brand-blue">
              Emerging Voices in Practice
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => onGoToDirectory?.()}
                className="px-6 py-3 bg-brand-orange text-white rounded-lg text-1.6 font-medium hover:bg-brand-orange-hover transition-colors"
              >
                View Directory
              </button>
            </div>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((l) => (
                // No onSelect — Analytics cards are display-only until profile modal is wired here
                <LeaderCard key={l.id} leader={l} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 text-1.4">
              No featured leaders configured.
            </div>
          )}
        </div>

        <p className="text-center text-1.1 text-gray-600 mt-6">
          Data sourced from the Transform Health Women Leaders Database · {stats.total} verified profiles
        </p>
      </div>

      {/* Manage profile footer */}
      <div className="text-center pt-[2.4rem] pb-[3.2rem] font-sans">
        <p className="text-1.4 text-gray-500">
          Already in the database?{" "}
          <button
            onClick={() => onManageProfile(null)}
            className="bg-transparent border-0 cursor-pointer text-brand-navy font-semibold text-1.4 underline p-0"
          >
            Manage or remove your profile
          </button>
        </p>
      </div>
    </div>
  );
}
