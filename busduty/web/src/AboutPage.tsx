import { useState } from "react";

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPinModal, setShowPinModal] = useState<'office' | 'busduty' | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  async function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const endpoint = showPinModal === 'office' ? '/api/auth/office' : '/api/auth/busduty';
    const r = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ pin, school: 'mpjh11243' })
    });
    
    if (r.ok) {
      sessionStorage.setItem('auth', JSON.stringify({ pin, school: 'mpjh11243', role: showPinModal }));
      window.location.href = showPinModal === 'office' ? '/office' : '/busduty';
    } else {
      setError("Invalid PIN");
    }
  }

  return (
    <div className="website-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="/" className="nav-brand" style={{ textDecoration: 'none' }}>
            <img src="/logo.png" alt="BusDuty" className="nav-logo" />
            <span className="nav-title">
              BusDuty<span style={{ fontSize: '0.7em', opacity: 0.8 }}>.com</span>
            </span>
          </a>
          
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <a href="/#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="/about" className="active">About</a>
            <a 
              href="/signup"
              className="nav-cta"
              style={{ textDecoration: 'none', display: 'inline-block' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      {/* About Content */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-header">
            <h1 className="about-title">The BusDuty.com Story</h1>
            <div className="about-byline">
              <p className="about-author">By Brian Duryea</p>
              <p className="about-meta">Mueller Park Junior High, Room 403</p>
              <p className="about-date">August 13, 2025 • 3:32 PM</p>
            </div>
          </div>
          
          <div className="about-content">
            <div className="about-story">
              <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                Standing outside in the middle of January weather in Utah, halfway through the third term, 
                still explaining—again—to a parent why they can't drive into the bus lane, I thought:{' '}
                <em>there's gotta be an app for this</em>.
              </p>
              
              <p>
                If only there were a computer science teacher with almost no summer plans…
              </p>
              
              <p>
                Then I discovered {' '}
                <a href="https://busduty.com" style={{ color: '#FFC107', textDecoration: 'underline' }}>busduty.com</a> was available. 
                Seriously? If you've hunted for a domain name in the last 25 years, 
                you know two‑word ones are like rare Pokémon.
              </p>
              
              <p>
                So, domain in hand and a summer of freedom ahead, I set out to do what no one had dared 
                before: make Bus Duty… cool.
              </p>

              <h2>The Problem</h2>
              <p>
                Bus duty—especially the morning shift—is never a coveted assignment. You're outside a solid 
                half‑hour before school, no matter the weather. Clipboard in hand, you're fielding questions 
                from hurried, confused parents while kids scatter in every direction. Someone needs to know 
                where to park, someone else needs to know what time the assembly is today, and meanwhile a 
                busload of students is stuck in the intersection waiting. It's chaos with a side of frozen 
                fingers. And yes, I'm also supposed to teach a class in five minutes that's a six‑minute 
                walk away. Not exactly an assignment people fight over.
              </p>

              <h2>The Solution</h2>
              <p>
                An app isn't a magic fix—but it does remove a step. Big, glove‑friendly buttons let me mark 
                arrivals, and the office sees updates instantly—no phone calls, no clipboards, no rain‑drenched 
                paper, no guesswork. The only downside? I miss my daily shoutout to the office staff when I 
                dropped off the clipboard. <em>Technology has its price.</em>
              </p>
              
              <p>
                Under the hood: a Progressive Web App that works offline, runs on Cloudflare's edge network, 
                and costs almost nothing to operate—assuming this doesn't actually get popular. Works on phones, 
                tablets—whatever's handy. As they say around here, <em>it's fire</em>.
              </p>

              <h2>Current Status</h2>
              <p>
                The app is live at Mueller Park Junior High—patient zero. Buses get tracked, the office stays 
                informed, and… well, parents still try to drive in the bus lane, but we're working on that. 
                Reports archive automatically for records.
              </p>
              
              <p>
                Any school can use it. Sign up, get a school code, set a PIN, start tracking. It's free, 
                student‑safe, and probably niche enough to stay within Cloudflare's free tier forever.
              </p>
              
              <p>
                The domain? Ten bucks a year—call it my donation to education writ large, my token of solidarity 
                with those of us who have been roped into bus duty out of respect for our vice principal's 
                never-ending plight, and my personal stand to make sure good domain names do 
                exactly what they are destined to do.
              </p>

              <p>
                Built in summer 2025. Running daily ever since. Making bus duty slightly more tolerable—maybe 
                even cool—one tap at a time.
              </p>
              
              <div style={{ textAlign: 'right', marginTop: '2rem', fontStyle: 'italic', fontSize: '1.125rem', color: '#555' }}>
                ~Brian Duryea
              </div>
            </div>

            <div className="about-cta">
              <h3>Want to Use It at Your School?</h3>
              <p>It's ready to go. No setup fees. No monthly costs.</p>
              <div className="about-buttons">
                <a href="/busduty" className="about-btn primary">
                  Start Tracking Buses
                </a>
              </div>
            </div>

            <div className="about-footer-note">
              <p>
                Built at Mueller Park Junior High<br/>
                Davis School District, Utah
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <img src="/logo.png" alt="BusDuty" className="footer-logo" />
              <p>Making bus duty suck less, one tap at a time</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/busduty">Bus Duty</a>
              <a href="/office">Office</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 BusDuty — Mueller Park Junior High</p>
          </div>
        </div>
      </footer>

      {/* PIN Modal */}
      {showPinModal && (
        <div className="pin-modal-overlay" onClick={() => setShowPinModal(null)}>
          <div className="pin-modal" onClick={e => e.stopPropagation()}>
            <h2>{showPinModal === 'office' ? 'Office Login' : 'Bus Duty Login'}</h2>
            <p>Enter your school access PIN</p>
            <form onSubmit={handlePinSubmit}>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter PIN"
                value={pin}
                onChange={e => setPin(e.target.value)}
                className="pin-input"
                autoFocus
              />
              {error && <p className="pin-error">{error}</p>}
              <div className="pin-buttons">
                <button type="button" onClick={() => setShowPinModal(null)} className="pin-cancel">
                  Cancel
                </button>
                <button type="submit" className="pin-submit">
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}