import { useState } from "react";

export default function SignupPage() {
  const [step, setStep] = useState<'info' | 'verify' | 'complete'>('info');
  const [formData, setFormData] = useState({
    schoolName: '',
    adminEmail: '',
    password: '',
    confirmPassword: '',
    expectedBuses: '',
    timezone: 'America/Denver'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [schoolData, setSchoolData] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    
    // Debug logging
    console.log('Form data on submit:', formData);
    
    // Check all required fields
    if (!formData.schoolName || !formData.adminEmail || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      console.log('Missing fields:', {
        schoolName: !formData.schoolName,
        adminEmail: !formData.adminEmail,
        password: !formData.password,
        confirmPassword: !formData.confirmPassword
      });
      return;
    }
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setLoading(true);

    // For now, mock the signup process since API isn't ready
    console.log('Signup data:', {
      schoolName: formData.schoolName,
      email: formData.adminEmail,
      expectedBuses: formData.expectedBuses,
      timezone: formData.timezone
    });
    
    // Mock successful signup for testing
    alert('TEST MODE: No email will be sent. Click OK to continue to verification step.');
    setStep('verify');
    setLoading(false);
    
    /* Uncomment when API is ready:
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName: formData.schoolName,
          email: formData.adminEmail,
          password: formData.password,
          expectedBuses: formData.expectedBuses,
          timezone: formData.timezone
        })
      });

      if (response.ok) {
        setStep('verify');
      } else {
        const data = await response.json();
        setError(data.error || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
    */
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Mock verification for testing
      if (verificationCode.length > 0) {
        setTimeout(() => {
          // Generate 5-character alphanumeric PIN (uppercase)
          const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          let mockPin = '';
          for (let i = 0; i < 5; i++) {
            mockPin += characters.charAt(Math.floor(Math.random() * characters.length));
          }
          
          const mockData = {
            schoolCode: 'sch_' + Math.random().toString(36).substring(2, 9),
            officePin: mockPin,
            schoolName: formData.schoolName,
            email: formData.adminEmail,
            password: formData.password
          };
          
          // Store in sessionStorage for mock sign-in
          sessionStorage.setItem('mockAccount', JSON.stringify(mockData));
          
          setSchoolData(mockData);
          setStep('complete');
          setLoading(false);
        }, 1000);
      } else {
        setError('Please enter a verification code');
        setLoading(false);
      }
      
      /* Uncomment when API is ready:
      const response = await fetch('/api/verify-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.adminEmail,
          code: verificationCode 
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSchoolData(data);
        setStep('complete');
      } else {
        setError('Invalid verification code');
      }
      */
    } catch (err) {
      setError('Verification failed. Please try again.');
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
        </div>
      </nav>

      <section className="signup-section" style={{ 
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div className="signup-container" style={{
          width: '100%',
          maxWidth: '500px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          padding: '2.5rem'
        }}>
          {step === 'info' && (
            <>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#2C3E50' }}>
                Get Started with BusDuty
              </h1>
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                Set up bus tracking for your school in minutes
              </p>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    School Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Mueller Park Junior High"
                    value={formData.schoolName}
                    onChange={e => setFormData({...formData, schoolName: e.target.value})}
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
                    Bus Duty Personnel Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    value={formData.adminEmail}
                    onChange={e => setFormData({...formData, adminEmail: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                  <small style={{ color: '#666', fontSize: '0.875rem' }}>
                    We'll send your office PIN to this email
                  </small>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      minLength={8}
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
                        top: '35%',
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
                  <small style={{ color: '#666', fontSize: '0.875rem' }}>
                    At least 8 characters
                  </small>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Confirm Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Expected Number of Buses (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="e.g., 15"
                    value={formData.expectedBuses}
                    onChange={e => setFormData({...formData, expectedBuses: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                  <small style={{ color: '#666', fontSize: '0.875rem' }}>
                    You can adjust this later in settings
                  </small>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Time Zone
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={e => setFormData({...formData, timezone: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Phoenix">Arizona Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="America/Anchorage">Alaska Time</option>
                    <option value="Pacific/Honolulu">Hawaii Time</option>
                  </select>
                </div>

                {error && (
                  <div style={{
                    background: '#FEE',
                    color: '#C00',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    marginBottom: '1rem'
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
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <p style={{ marginTop: '2rem', textAlign: 'center', color: '#666' }}>
                Already have an account? <a href="/signin" style={{ color: '#FFC107' }}>Sign in</a>
              </p>
            </>
          )}

          {step === 'verify' && (
            <>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#2C3E50' }}>
                Check Your Email
              </h1>
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                We've sent a verification code to {formData.adminEmail}
              </p>

              <form onSubmit={handleVerify}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                    Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '1.5rem',
                      textAlign: 'center',
                      letterSpacing: '0.25rem'
                    }}
                    maxLength={6}
                    pattern="[0-9]{6}"
                  />
                </div>

                {error && (
                  <div style={{
                    background: '#FEE',
                    color: '#C00',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    marginBottom: '1rem'
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
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </form>

              <p style={{ marginTop: '2rem', textAlign: 'center', color: '#666' }}>
                Didn't receive the email? <button 
                  onClick={() => handleSubmit(new Event('submit') as any)}
                  style={{ background: 'none', border: 'none', color: '#FFC107', cursor: 'pointer' }}
                >
                  Resend code
                </button>
              </p>
            </>
          )}

          {step === 'complete' && schoolData && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: '#4CAF50',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '2.5rem',
                  color: 'white'
                }}>
                  ✓
                </div>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#2C3E50' }}>
                  Welcome to BusDuty!
                </h1>
                <p style={{ color: '#666' }}>
                  Your school account has been created successfully
                </p>
              </div>

              <div style={{
                background: '#F5F5F5',
                borderRadius: '8px',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <h3 style={{ marginBottom: '1rem', color: '#2C3E50' }}>Important: Save This Information</h3>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <strong>Your Office Access PIN:</strong>
                  <div style={{
                    background: '#FFC107',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '1.5rem',
                    marginTop: '0.5rem',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#2C3E50'
                  }}>
                    {schoolData.officePin}
                  </div>
                  <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>
                    Share this PIN with office staff to let them view the bus arrival dashboard
                  </small>
                </div>

                <div>
                  <strong>Your Login Email:</strong>
                  <div style={{
                    background: 'white',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    marginTop: '0.25rem'
                  }}>
                    {formData.adminEmail}
                  </div>
                </div>
              </div>

              <div style={{
                background: '#FFF8E1',
                border: '1px solid #FFD54F',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '2rem'
              }}>
                <strong style={{ color: '#F57C00' }}>⚠️ Important:</strong>
                <p style={{ margin: '0.5rem 0 0', color: '#666' }}>
                  Save these access codes! You'll need them to log in.
                  We've also emailed them to {formData.adminEmail}
                </p>
              </div>

              <a
                href="/signin"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '1rem',
                  background: '#FFC107',
                  color: '#2C3E50',
                  textAlign: 'center',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}
              >
                Sign In to Start Tracking Buses
              </a>
              
              <div style={{ marginTop: '1rem', display: 'none' }}>
                <a
                  href="/office"
                  style={{
                    display: 'block',
                    padding: '1rem',
                    background: 'white',
                    color: '#2C3E50',
                    border: '2px solid #FFC107',
                    textAlign: 'center',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Go to Office View
                </a>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}