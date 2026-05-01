import { useState, useEffect, useMemo } from "react";
import { api } from "../api/leaders";

// Exported so Database can reuse for country dropdown filtering
export const COUNTRY_TO_CONTINENT = {
  "South Africa": "Africa",  Nigeria: "Africa",    Kenya: "Africa",
  Tanzania:       "Africa",  Uganda: "Africa",     Ghana: "Africa",
  Ethiopia:       "Africa",  Rwanda: "Africa",     Senegal: "Africa",
  India:          "Asia",    Malaysia: "Asia",     China: "Asia",     Japan: "Asia",
  France:         "Europe",  "United Kingdom": "Europe", Germany: "Europe", Switzerland: "Europe",
  "United States": "North America", Canada: "North America",
  Brazil:         "South America",
  Australia:      "Oceania",
};

/**
 * useLeaders — single source of truth for leader data.
 *
 * All params are optional primitives so useMemo deps stay stable
 * across renders without needing deep-equality.
 *
 * Returns:
 *   leaders    — filtered + sorted array (no pagination; UI slices this)
 *   allLeaders — raw unfiltered array (for Analytics stats)
 *   loading    — true while initial fetch is in flight
 *   error      — fetch error, or null
 */
export function useLeaders({
  search    = "",
  expertise = "",
  country   = "",
  continent = "",
  sort      = "",
} = {}) {
  const [allLeaders, setAllLeaders] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    api.getLeaders()
      .then(setAllLeaders)
      .catch((e) => { console.error("useLeaders: fetch failed", e); setError(e); })
      .finally(() => setLoading(false));
  }, []);

  const leaders = useMemo(() => {
    let result = allLeaders;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((l) =>
        [l.first_name, l.last_name, l.role, l.organisation, l.bio]
          .some((f) => (f || "").toLowerCase().includes(q))
      );
    }

    if (expertise) result = result.filter((l) => (l.expertise || "").includes(expertise));
    if (country)   result = result.filter((l) => l.country === country);
    if (continent) result = result.filter((l) => COUNTRY_TO_CONTINENT[l.country] === continent);

    if (sort === "az")     return [...result].sort((a, b) => (a.first_name || "").localeCompare(b.first_name || ""));
    if (sort === "za")     return [...result].sort((a, b) => (b.first_name || "").localeCompare(a.first_name || ""));
    if (sort === "latest") return [...result].reverse();

    return result;
  }, [allLeaders, search, expertise, country, continent, sort]);

  return { leaders, allLeaders, loading, error };
}
