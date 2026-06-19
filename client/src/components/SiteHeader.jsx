import { useState } from "react";

const BASE = "https://transformhealth.rrzdev.co.za";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/our-story/" },
  { label: "Our Work", href: "/our-work/" },
  { label: "Partnerships", href: "/partnerships/" },
  {
    label: "National Coalitions",
    dropdown: [
      { label: "Ecuador", href: "/ecuador/" },
      { label: "Kenya", href: "/kenya/" },
      { label: "India", href: "/india/" },
      { label: "Indonesia", href: "/indonesia/" },
      { label: "Mexico", href: "/mexico/" },
      { label: "Senegal", href: "/senegal/" },
    ],
  },
  { label: "Insights", href: "/insights/" },
  { label: "Events", href: "/#whats_new" },
  { label: "Contact us", href: "/contact/" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-white w-full fixed top-0 z-[999] font-sans shadow-sm">
      <div className="container-fluid max-w-[1400px] mx-auto flex justify-between items-center px-4 py-3">
        <a href={BASE} className="navbar-brand">
          <img
            src="https://transformhealth.rrzdev.co.za/wp-content/uploads/2026/02/TH-Logo-Hor-FC.svg"
            alt="Transform Health"
            className="h-[3.2rem] sm:h-[3.6rem] block"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex list-none m-0 p-0 items-center gap-1">
            {NAV_LINKS.map((item) =>
              item.dropdown ? (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button className="text-1.4 px-3 py-2 text-brand-dark no-underline font-medium hover:text-brand-pink bg-transparent border-0 cursor-pointer flex items-center gap-1 whitespace-nowrap">
                    {item.label}
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <ul className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 min-w-[180px] list-none m-0 p-0 z-50">
                      {item.dropdown.map((sub) => (
                        <li key={sub.label}>
                          <a
                            href={`${BASE}${sub.href}`}
                            className="block px-4 py-2 text-1.4 text-brand-dark no-underline hover:bg-gray-100 hover:text-brand-pink whitespace-nowrap"
                          >
                            {sub.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={item.label}>
                  <a
                    href={`${BASE}${item.href}`}
                    className="text-1.4 px-3 py-2 text-brand-dark no-underline font-medium hover:text-brand-pink whitespace-nowrap"
                  >
                    {item.label}
                  </a>
                </li>
              )
            )}
            {/* Search */}
            <li>
              <a
                href="#"
                className="px-3 py-2 text-brand-dark hover:text-brand-pink"
                aria-label="Search"
              >
                <svg width="20" height="20" viewBox="0 0 23 23" fill="none">
                  <circle cx="8.5" cy="8.5" r="7.5" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="15.8555" y1="16.2929" x2="21.8555" y2="22.2929" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </a>
            </li>
          </ul>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2 cursor-pointer bg-transparent border-0"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className={`block w-6 h-[2px] bg-brand-dark transition-transform duration-200 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block w-6 h-[2px] bg-brand-dark transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-[2px] bg-brand-dark transition-transform duration-200 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <nav className="md:hidden border-t border-gray-200 bg-white max-h-[80vh] overflow-y-auto">
          <ul className="list-none m-0 p-0 flex flex-col">
            {NAV_LINKS.map((item) =>
              item.dropdown ? (
                <li key={item.label}>
                  <span className="block text-1.4 px-4 py-3 text-brand-dark font-medium border-b border-gray-100">
                    {item.label}
                  </span>
                  <ul className="list-none m-0 p-0 bg-gray-50">
                    {item.dropdown.map((sub) => (
                      <li key={sub.label}>
                        <a
                          href={`${BASE}${sub.href}`}
                          className="block text-1.4 px-8 py-2.5 text-brand-dark no-underline hover:text-brand-pink"
                          onClick={() => setMenuOpen(false)}
                        >
                          {sub.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.label}>
                  <a
                    href={`${BASE}${item.href}`}
                    className="block text-1.4 px-4 py-3 text-brand-dark no-underline hover:text-brand-pink border-b border-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              )
            )}
            {/* Search in mobile */}
            <li>
              <a
                href="#"
                className="flex items-center gap-2 text-1.4 px-4 py-3 text-brand-dark no-underline hover:text-brand-pink border-b border-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                <svg width="18" height="18" viewBox="0 0 23 23" fill="none">
                  <circle cx="8.5" cy="8.5" r="7.5" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="15.8555" y1="16.2929" x2="21.8555" y2="22.2929" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Search
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
