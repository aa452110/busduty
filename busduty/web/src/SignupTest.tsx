import { useState } from "react";

export default function SignupTest() {
  const [step, setStep] = useState<'info' | 'complete'>('info');
  const [formData, setFormData] = useState({
    schoolName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Generate mock PIN
    const mockPin = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Store mock data
    sessionStorage.setItem('mockSignup', JSON.stringify({
      ...formData,
      officePin: mockPin
    }));
    
    setStep('complete');
  }

  if (step === 'complete') {
    const data = JSON.parse(sessionStorage.getItem('mockSignup') || '{}');
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        padding: '2rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ color: '#4CAF50', marginBottom: '1rem' }}>✓ Success!</h1>
          <p>Account created for: <strong>{data.schoolName}</strong></p>
          <p>Email: <strong>{data.email}</strong></p>
          <div style={{
            background: '#FFC107',
            padding: '1rem',
            borderRadius: '8px',
            marginTop: '1rem',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Your Office PIN:</p>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>{data.officePin}</p>
          </div>
          <a 
            href="/signin" 
            style={{
              display: 'block',
              marginTop: '1.5rem',
              padding: '0.75rem',
              background: '#2C3E50',
              color: 'white',
              textAlign: 'center',
              borderRadius: '8px',
              textDecoration: 'none'
            }}
          >
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ marginBottom: '1rem' }}>Sign Up (Test Mode)</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              School Name
            </label>
            <input
              type="text"
              required
              value={formData.schoolName}
              onChange={e => setFormData({...formData, schoolName: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #E0E0E0',
                borderRadius: '8px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #E0E0E0',
                borderRadius: '8px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #E0E0E0',
                borderRadius: '8px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #E0E0E0',
                borderRadius: '8px'
              }}
            />
          </div>
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              background: '#FFC107',
              color: '#2C3E50',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Create Test Account
          </button>
        </form>
      </div>
    </div>
  );
}