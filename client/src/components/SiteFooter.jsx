export default function SiteFooter() {
  return (
    <footer style={{ fontFamily: "'Montserrat', sans-serif", position: 'relative', backgroundColor: '#FEE5F6' }}>

      {/* SVG background image sets the natural height — content sits on top of it */}
      <div style={{ position: 'relative' }}>
        <img
          src="https://transformhealthcoalition.org/wp-content/themes/th/assets/images/footer_icon_bg.svg"
          alt=""
          style={{ display: 'block', width: '100%', padding: '25px 5vw', boxSizing: 'border-box' }}
        />

        {/* Content absolutely centred over the SVG — matches parent site's top:45% left:55% */}
        <div style={{
          position: 'absolute',
          top: '45%',
          left: '55%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '70%',
          width: '100%',
        }}>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-end' }}>

            {/* Left: links */}
            <div style={{ flex: 1 }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'Policies',
                  'Media Enquiries',
                  'Get Involved',
                  'Opportunities',
                  'Equity & Inclusion Dashboard',
                  'Privacy Policy',
                ].map((link) => (
                  <li key={link} style={{ marginBottom: 6 }}>
                    <a href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: 14 }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: newsletter */}
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 20, fontWeight: 400, color: '#fff', marginBottom: 15, marginTop: 0 }}>
                Subscribe to Transform Health's Newsletter: the Digest
              </p>
              <div style={{ position: 'relative', maxWidth: 340 }}>
                <input
                  type="email"
                  placeholder="Your email address"
                  style={{
                    width: '100%',
                    height: 40,
                    borderRadius: 10,
                    padding: '0 50px 0 15px',
                    border: 0,
                    fontSize: 15,
                    boxSizing: 'border-box',
                  }}
                />
                <button style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 16,
                  color: '#006EA7',
                }}>
                  →
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div style={{
        background: '#002D48',
        color: '#fff',
        fontSize: 14,
        fontWeight: 300,
        padding: '10px 0',
        textAlign: 'center',
      }}>
        Copyright © {new Date().getFullYear()} Transform Health. All Rights Reserved.
      </div>

    </footer>
  )
}
