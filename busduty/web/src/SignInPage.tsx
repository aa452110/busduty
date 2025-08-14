import { useState } from "react";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Check mock account first
    const mockAccount = JSON.parse(sessionStorage.getItem('mockAccount') || '{}');
    
    if (mockAccount.email === formData.email && mockAccount.password === formData.password) {
      // Mock sign-in successful
      sessionStorage.setItem('auth', JSON.stringify({
        token: 'mock_token_' + Date.now(),
        email: formData.email,
        schoolCode: mockAccount.schoolCode,
        officePin: mockAccount.officePin
      }));
      
      setTimeout(() => {
        window.location.href = '/busduty';
      }, 500);
      
      return;
    }
    
    // If no mock account matches, try real API (will fail for now)
    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        // Store auth token
        sessionStorage.setItem('auth', JSON.stringify({
          token: data.token,
          email: formData.email,
          schoolCode: data.schoolCode
        }));
        // Redirect to bus duty page
        window.location.href = '/busduty';
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('Invalid email or password. Did you sign up first?');
    } finally {
      setLoading(false);
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
            <a href="/about" onClick={() => setMobileMenuOpen(false)}>About</a>
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

      <section className="signin-section" style={{ 
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div className="signin-container" style={{
          width: '100%',
          maxWidth: '400px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          padding: '2.5rem'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#2C3E50', textAlign: 'center' }}>
            Welcome Back
          </h1>
          <p style={{ color: '#666', marginBottom: '2rem', textAlign: 'center' }}>
            Sign in to log bus arrivals
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Email
              </label>
              <input
                type="email"
                required
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #E0E0E0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    paddingRight: '3rem',
                    border: '2px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    fontSize: '1.25rem',
                    color: '#666'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '0.75rem',
                background: '#ffebee',
                border: '1px solid #ffcdd2',
                borderRadius: '8px',
                color: '#c62828',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                background: loading ? '#ccc' : '#FFC107',
                color: '#2C3E50',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '1rem'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <a 
                href="/forgot-password" 
                style={{ 
                  color: '#666', 
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}
                onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'}
                onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}
              >
                Forgot your password?
              </a>
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E0E0E0' }}>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>
                  Don't have an account?{' '}
                </span>
                <a 
                  href="/signup" 
                  style={{ 
                    color: '#FFC107', 
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}
                  onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}
                >
                  Sign Up
                </a>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Simple Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#666',
        fontSize: '0.875rem'
      }}>
        <p>© 2025 BusDuty • Mueller Park Junior High</p>
      </footer>
    </div>
  );
}