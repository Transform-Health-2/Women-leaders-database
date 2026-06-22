const BASE = "https://transformhealthcoalition.org";

const COLUMN_1 = [
  { label: "Our Story", href: "/our-story/" },
  { label: "Digital Health for UHC", href: "/digital-health-for-uhc/" },
  { label: "Our Work", href: "/our-work/" },
  { label: "Partnerships", href: "/partnerships/" },
  { label: "Insights", href: "/insights/" },
];

const COLUMN_2 = [
  { label: "National Coalitions", heading: true },
  { label: "Ecuador", href: "/ecuador/" },
  { label: "Indonesia", href: "/indonesia/" },
  { label: "India", href: "/india/" },
  { label: "Kenya", href: "/kenya/" },
  { label: "Mexico", href: "/mexico/" },
  { label: "Senegal", href: "/senegal/" },
];

const COLUMN_3 = [
  { label: "Policies", href: "/policies/" },
  { label: "Media Enquiries", href: "/media-enquiries/" },
  { label: "Opportunities", href: "/opportunities/" },
  { label: "Equity & Inclusion Dashboard", href: "/equity-inclusion-dashboard/" },
];

export default function SiteFooter() {
  return (
    <footer className="font-sans bg-brand-navy text-white">
      <div className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1 */}
        <div>
          <ul className="list-none m-0 p-0 space-y-2">
            {COLUMN_1.map((link) => (
              <li key={link.label}>
                <a
                  href={`${BASE}${link.href}`}
                  className="text-white no-underline text-1.4 hover:opacity-80"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <ul className="list-none m-0 p-0 space-y-2">
            {COLUMN_2.map((link) =>
              link.heading ? (
                <li key={link.label} className="font-semibold mb-1 text-1.4">
                  {link.label}
                </li>
              ) : (
                <li key={link.label} className="ml-3">
                  <a
                    href={`${BASE}${link.href}`}
                    className="text-white no-underline text-1.4 hover:opacity-80"
                  >
                    {link.label}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <ul className="list-none m-0 p-0 space-y-2">
            {COLUMN_3.map((link) => (
              <li key={link.label}>
                <a
                  href={`${BASE}${link.href}`}
                  className="text-white no-underline text-1.4 hover:opacity-80"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Get in touch & Social */}
      <div className="border-t border-white/20 max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-1.6 font-bold mb-4">GET IN TOUCH</h3>
            <div className="flex gap-4">
              {/* Social icons */}
              <a href="#" aria-label="X (Twitter)" className="text-white hover:opacity-80">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="text-white hover:opacity-80">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className="text-white hover:opacity-80">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={`${BASE}/newsletter/`}
              className="inline-flex items-center gap-2 bg-white text-brand-navy font-semibold text-1.3 px-6 py-3 rounded hover:bg-gray-100 no-underline uppercase tracking-wider"
            >
              SUBSCRIBE TO OUR NEWSLETTER
              <span className="text-xl">&rsaquo;</span>
            </a>
            <a
              href={`${BASE}/partner-with-us/`}
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white font-semibold text-1.3 px-6 py-3 rounded hover:bg-white hover:text-brand-navy no-underline uppercase tracking-wider"
            >
              PARTNER WITH US
              <span className="text-xl">&rsaquo;</span>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-brand-navy-dark text-white text-1.3 font-light py-4 text-center border-t border-white/10">
        &copy; Copyright {new Date().getFullYear()} &nbsp;|&nbsp; Transform Health &nbsp;|&nbsp; All Rights Reserved
      </div>
    </footer>
  );
}
