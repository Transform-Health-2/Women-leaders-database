// Centralized country → continent mapping
// Used by: useLeaders hook, Analytics page, Database filters

// Map from world-atlas country name → our canonical name
export const ATLAS_TO_CANONICAL = {
  "United States of America": "United States",
  "United Kingdom": "United Kingdom",
  "South Africa": "South Africa",
};

// Canonical name → continent
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

// Analytics page: canonical country name → region key
export const COUNTRY_TO_REGION = {
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

// No manual exclusions needed — highlighting is driven by actual leader data (country field)

export const REGION_LABELS = {
  north_america:    "North America",
  latin_america:    "Latin America",
  europe:           "Europe",
  sub_saharan_africa: "Sub-Saharan Africa",
  south_asia:       "South & SE Asia",
};

export const REGION_MARKERS = [
  { key: "north_america",      coordinates: [-95, 40],  oceanCoords: [-65, 30]  },  // W. North Atlantic (off Carolina coast)
  { key: "latin_america",      coordinates: [-55, -10], oceanCoords: [-33, -20] },  // South Atlantic (east of Brazil)
  { key: "europe",             coordinates: [10, 50],   oceanCoords: [-20, 50]  },  // N. Atlantic (west of UK)
  { key: "sub_saharan_africa", coordinates: [20, 5],    oceanCoords: [-8, -20]  },  // South Atlantic (off Namibia)
  { key: "south_asia",         coordinates: [80, 20],   oceanCoords: [88, 10]   },  // Bay of Bengal
];

export const CONTINENTS = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania"];
