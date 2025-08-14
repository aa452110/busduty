import { useState, useEffect } from "react";

export default function AccountPage() {
  const [userData, setUserData] = useState<any>(null);
  const [officePin, setOfficePin] = useState('');
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const auth = JSON.parse(sessionStorage.getItem('auth') || '{}');
    if (!auth.token) {
      window.location.href = '/signin';
      return;
    }
    
    // Load user data
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      const auth = JSON.parse(sessionStorage.getItem('auth') || '{}');
      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setOfficePin(data.officePin);
      }
    } catch (err) {
      console.error('Failed to load user data');
    }
  }

  async function regeneratePin() {
    setLoading(true);
    setMessage('');
    
    try {
      const auth = JSON.parse(sessionStorage.getItem('auth') || '{}');
      const response = await fetch('/api/regenerate-pin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOfficePin(data.newPin);
        setMessage('PIN regenerated successfully! Make sure to share the new PIN with your office staff.');
        setShowRegenerateConfirm(false);
      }
    } catch (err) {
      setMessage('Failed to regenerate PIN. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleSignOut() {
    sessionStorage.removeItem('auth');
    window.location.href = '/';
  }

  if (!userData) {
    return (
      <div className="website-container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="website-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="/" className="nav-brand" style={{ textDecoration: 'none' }}>
            <img src="/logo.png" alt="BusDuty" className="nav-logo" />
            <span className="nav-title">BusDuty</span>
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
            <a href="/busduty" onClick={() => setMobileMenuOpen(false)}>Log Buses</a>
            <a href="/account" className="active" onClick={() => setMobileMenuOpen(false)}>Account</a>
            <button 
              onClick={handleSignOut}
              className="nav-cta"
              style={{ 
                background: '#E0E0E0',
                color: '#2C3E50',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <section style={{ 
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        minHeight: 'calc(100vh - 160px)'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#2C3E50' }}>
          Account Settings
        </h1>

        {/* School Info */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#2C3E50' }}>
            School Information
          </h2>
          <div style={{ marginBottom: '1rem' }}>
            <strong>School Name:</strong>
            <div style={{ color: '#666', marginTop: '0.25rem' }}>
              {userData.schoolName}
            </div>
          </div>
          <div>
            <strong>Your Email:</strong>
            <div style={{ color: '#666', marginTop: '0.25rem' }}>
              {userData.email}
            </div>
          </div>
        </div>

        {/* Office PIN */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#2C3E50' }}>
            Office Access PIN
          </h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Share this PIN with office staff to give them access to the live dashboard
          </p>
          
          <div style={{
            background: '#FFC107',
            padding: '1.5rem',
            borderRadius: '8px',
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#2C3E50',
              letterSpacing: '0.25rem'
            }}>
              {officePin}
            </div>
          </div>

          {message && (
            <div style={{
              padding: '0.75rem',
              background: message.includes('success') ? '#E8F5E9' : '#FFEBEE',
              color: message.includes('success') ? '#2E7D32' : '#C62828',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              {message}
            </div>
          )}

          <button
            onClick={() => setShowRegenerateConfirm(true)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'white',
              color: '#F57C00',
              border: '2px solid #F57C00',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Regenerate PIN
          </button>

          <p style={{ color: '#999', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Note: Regenerating will invalidate the old PIN immediately
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#2C3E50' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <a
              href="/busduty"
              style={{
                display: 'block',
                padding: '1rem',
                background: '#FFC107',
                color: '#2C3E50',
                textAlign: 'center',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Go to Bus Tracking
            </a>
            <a
              href="/office"
              style={{
                display: 'block',
                padding: '1rem',
                background: 'white',
                color: '#2C3E50',
                border: '2px solid #E0E0E0',
                textAlign: 'center',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              View Office Dashboard (Test)
            </a>
          </div>
        </div>
      </section>

      {/* Regenerate PIN Confirmation Modal */}
      {showRegenerateConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '400px',
            width: '100%'
          }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>
              Regenerate Office PIN?
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              This will immediately invalidate the current PIN. Office staff will need the new PIN to access the dashboard.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowRegenerateConfirm(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#E0E0E0',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={regeneratePin}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: loading ? '#ccc' : '#F57C00',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Regenerating...' : 'Regenerate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#666',
        fontSize: '0.875rem',
        borderTop: '1px solid #E0E0E0'
      }}>
        <p>© 2025 BusDuty • Mueller Park Junior High</p>
      </footer>
    </div>
  );
}