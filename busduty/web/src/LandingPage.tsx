import { useState } from "react";

export default function LandingPage() {
  const [showPinModal, setShowPinModal] = useState<'office' | 'busduty' | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="/about">About</a>
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

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Simple Bus Tracking<br/>
            <span className="hero-highlight">For Modern Schools</span>
          </h1>
          <p className="hero-subtitle">
            Track bus arrivals in real-time. Keep parents informed. 
            Streamline your morning routine.
          </p>
          <div className="hero-buttons">
            <button 
              className="hero-btn primary"
              onClick={() => window.location.href = '/signin'}
            >
              Bus Duty Login
            </button>
            <button 
              className="hero-btn secondary"
              onClick={() => setShowPinModal('office')}
            >
              Office Dashboard
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img src="/logo.png" alt="BusDuty App" className="hero-logo" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <h2 className="section-title">Why Schools Choose BusDuty</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Real-Time Updates</h3>
              <p>Instant notifications when buses arrive. No more guessing or waiting.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Works Everywhere</h3>
              <p>Access from any device. Install as an app on phones and tablets.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>PIN-protected access. No student data stored. FERPA compliant.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Daily Reports</h3>
              <p>Automatic CSV archives for record keeping and analysis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-section">
        <div className="section-container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Bus Arrives</h3>
              <p>Staff member on bus duty sees a bus pull up</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Tap Button</h3>
              <p>They tap the bus number on their phone or tablet</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Office Sees Update</h3>
              <p>Office dashboard instantly shows which buses have arrived</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Data Stored</h3>
              <p>Arrival records saved and easily accessible anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <h2>Ready to Streamline Your Bus Duty?</h2>
          <p>Join schools that have simplified their morning routine</p>
          <div className="cta-buttons">
            <button 
              className="cta-btn office"
              onClick={() => setShowPinModal('office')}
            >
              <div>
                <strong>Office Dashboard</strong>
                <small>Monitor arrivals from your desk</small>
              </div>
            </button>
            <button 
              className="cta-btn busduty"
              onClick={() => window.location.href = '/signin'}
            >
              <div>
                <strong>Bus Duty Login</strong>
                <small>Track arrivals on-site</small>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <img src="/logo.png" alt="BusDuty" className="footer-logo" />
              <p>Simple bus tracking for modern schools</p>
            </div>
            <div className="footer-section">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <a href="/about">About Us</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 BusDuty. All rights reserved.</p>
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