import { useEffect, useState } from "react";

export default function OfficeView(){
  const [state,setState] = useState<any>({ arrived:[], remaining:[] });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'today' | 'history'>('today');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [historyDates, setHistoryDates] = useState<string[]>([]);
  const [showCompleteMessage, setShowCompleteMessage] = useState(false);
  const [hasShownComplete, setHasShownComplete] = useState(false);
  const [historyData, setHistoryData] = useState<any>(null);
  
  // Get auth from session
  const auth = JSON.parse(sessionStorage.getItem('auth') || '{}');
  const school = auth.school || "mpjh11243";
  
  async function refresh(){ 
    const r=await fetch(`/api/state?school=${school}`); 
    const data = await r.json();
    setState(data);
    
    // Check if day was marked as complete and we haven't shown the message yet
    if (data.completed && data.completed_at && !hasShownComplete) {
      const timeDiff = Date.now() - data.completed_at;
      
      // If completed within last minute, show message
      if (timeDiff < 60000) {
        setHasShownComplete(true);
        setShowCompleteMessage(true);
        
        // Load today's data for history view
        const today = new Date().toISOString().split('T')[0];
        await loadHistoryForDate(today);
        
        setTimeout(() => {
          setShowCompleteMessage(false);
          // Switch to history view with today's date
          setSelectedDate(today);
          setViewMode('history');
        }, 3000);
      }
    }
  }

  async function loadHistoryForDate(date: string) {
    try {
      // Fetch the archived data for the specific date
      const r = await fetch(`/api/history?school=${school}&date=${date}`);
      if (r.ok) {
        const data = await r.json();
        setHistoryData(data);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }

  async function loadHistory() {
    // Mock history dates - in production would fetch from API
    const today = new Date();
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    setHistoryDates(dates);
  }

  function handleLogout() {
    sessionStorage.removeItem('auth');
    window.location.href = '/';
  }

  function getStats() {
    const totalBuses = state.arrived.length + state.remaining.length;
    const arrivalRate = totalBuses > 0 ? Math.round((state.arrived.length / totalBuses) * 100) : 0;
    const avgArrivalTime = state.arrived.length > 0 
      ? new Date(state.arrived.reduce((acc:number, a:any) => acc + a.ts_utc, 0) / state.arrived.length * 1000).toLocaleTimeString()
      : '--:--';
    const firstArrival = state.arrived.length > 0 
      ? new Date(Math.min(...state.arrived.map((a:any) => a.ts_utc)) * 1000).toLocaleTimeString()
      : '--:--';
    const lastArrival = state.arrived.length > 0
      ? new Date(Math.max(...state.arrived.map((a:any) => a.ts_utc)) * 1000).toLocaleTimeString()
      : '--:--';
    
    return { totalBuses, arrivalRate, avgArrivalTime, firstArrival, lastArrival };
  }
  
  useEffect(()=>{ 
    if (!auth.pin) {
      window.location.href = '/';
      return;
    }
    refresh();
    loadHistory();
    const t=setInterval(refresh, 5000); 
    return ()=>clearInterval(t); 
  },[]);

  useEffect(() => {
    if (selectedDate) {
      loadHistoryForDate(selectedDate);
    }
  }, [selectedDate]);

  const stats = getStats();
  
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
            <span className="header-subtitle">Date: {state.date_ymd || new Date().toISOString().split('T')[0]}</span>
            <button 
              className="nav-cta"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content" style={{ marginTop: '2rem' }}>
        {/* Bus Duty Complete Message */}
        {showCompleteMessage && (
          <div style={{
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
            animation: 'slideDown 0.5s ease'
          }}>
            <style>{`
              @keyframes slideDown {
                from {
                  transform: translateY(-100%);
                  opacity: 0;
                }
                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }
            `}</style>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              🎉 Bus Duty Complete!
            </h2>
            <p style={{ fontSize: '1rem', opacity: 0.95 }}>
              All buses have been tracked for today. Switching to history view...
            </p>
          </div>
        )}

        {/* Quick Stats Bar */}
        <div className="stats-bar" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div className="stat-card" style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50' }}>
              {stats.arrivalRate}%
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Arrived</div>
          </div>
          <div className="stat-card" style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2C3E50' }}>
              {stats.totalBuses}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Buses</div>
          </div>
          <div className="stat-card" style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2C3E50' }}>
              {stats.firstArrival}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>First Arrival</div>
          </div>
          <div className="stat-card" style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2C3E50' }}>
              {stats.lastArrival}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Last Arrival</div>
          </div>
        </div>

        {/* View Toggle */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '1rem',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setViewMode('today')}
            style={{
              padding: '0.5rem 1rem',
              background: viewMode === 'today' ? '#FFC107' : 'white',
              border: '2px solid #FFC107',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              color: viewMode === 'today' ? '#2C3E50' : '#666'
            }}
          >
            Today
          </button>
          <button
            onClick={() => setViewMode('history')}
            style={{
              padding: '0.5rem 1rem',
              background: viewMode === 'history' ? '#FFC107' : 'white',
              border: '2px solid #FFC107',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              color: viewMode === 'history' ? '#2C3E50' : '#666'
            }}
          >
            History
          </button>
          {viewMode === 'history' && (
            <select
              value={selectedDate || ''}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '8px',
                border: '2px solid #E0E0E0',
                marginLeft: 'auto'
              }}
            >
              <option value="">Select Date</option>
              {historyDates.map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          )}
        </div>

        {viewMode === 'today' ? (
          <>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              <div>
                <h2 className="section-title">✅ Arrived Buses</h2>
                <div className="card">
                  {state.arrived.length > 0 ? (
                    <ul className="arrival-list">
                      {state.arrived.map((a:any)=>(
                        <li key={a.bus_no+a.ts_utc} className="arrival-item">
                          <span className="arrival-bus">Bus {a.bus_no}</span>
                          <span className="arrival-time">
                            {new Date(a.ts_utc*1000).toLocaleTimeString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="empty-state">No buses have arrived yet</div>
                  )}
                </div>
              </div>
              
              <div>
                <h2 className="section-title">📋 Potential Buses</h2>
                <div className="card">
                  {state.remaining.length > 0 ? (
                    <div className="remaining-list">
                      {state.remaining.map((b:any)=>(
                        <div key={b.bus_no} className="remaining-item" style={{
                          borderLeftColor: '#FFC107'
                        }}>
                          Bus {b.bus_no}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">All potential buses have arrived</div>
                  )}
                </div>
              </div>
            </div>

          </>
        ) : (
          <div className="history-view">
            {selectedDate ? (
              <>
                <h2 className="section-title">📅 History for {selectedDate}</h2>
                {historyData ? (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '2rem',
                    marginBottom: '2rem'
                  }}>
                    <div>
                      <h3 className="section-title">Arrival Times</h3>
                      <div className="card">
                        {historyData.arrivals && historyData.arrivals.length > 0 ? (
                          <ul className="arrival-list">
                            {historyData.arrivals.map((a:any, idx:number)=>(
                              <li key={idx} className="arrival-item">
                                <span className="arrival-bus">Bus {a.bus_no}</span>
                                <span className="arrival-time">
                                  {new Date(a.ts_utc*1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="empty-state">No arrival data for this date</div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="section-title">Summary</h3>
                      <div className="card">
                        <div style={{ padding: '1rem' }}>
                          <p><strong>Total Buses:</strong> {historyData.arrivals?.length || 0}</p>
                          <p><strong>First Arrival:</strong> {
                            historyData.arrivals && historyData.arrivals.length > 0
                              ? new Date(Math.min(...historyData.arrivals.map((a:any) => a.ts_utc)) * 1000).toLocaleTimeString()
                              : 'N/A'
                          }</p>
                          <p><strong>Last Arrival:</strong> {
                            historyData.arrivals && historyData.arrivals.length > 0
                              ? new Date(Math.max(...historyData.arrivals.map((a:any) => a.ts_utc)) * 1000).toLocaleTimeString()
                              : 'N/A'
                          }</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card">
                    <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
                      Loading historical data...
                    </p>
                  </div>
                )}
                <button
                  onClick={() => {
                    setViewMode('today');
                    setHasShownComplete(false);
                  }}
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1.5rem',
                    background: '#FFC107',
                    color: '#2C3E50',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Back to Today
                </button>
              </>
            ) : (
              <div className="card">
                <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
                  Select a date from the dropdown to view historical data
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer" style={{ marginTop: 'auto' }}>
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <img src="/logo.png" alt="BusDuty" className="footer-logo" />
              <p>Simple bus tracking for modern schools</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <a href="/" onClick={handleLogout}>Home</a>
              <a href="/" onClick={handleLogout}>Switch Role</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 BusDuty. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}