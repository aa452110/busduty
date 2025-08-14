import { useEffect, useState } from "react";

export default function BusDutyApp() {
  const [remaining, setRemaining] = useState<any[]>([]);
  const [arrived, setArrived] = useState<any[]>([]);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [showAddBus, setShowAddBus] = useState(false);
  const [newBusNumber, setNewBusNumber] = useState("");
  const [editingTime, setEditingTime] = useState<{ bus_no: string; current_time: number } | null>(null);
  const [newTime, setNewTime] = useState("");
  const [showDoneConfirm, setShowDoneConfirm] = useState(false);
  const [archiveStatus, setArchiveStatus] = useState<'idle' | 'saving' | 'complete'>('idle');
  
  // Get auth from session
  const auth = JSON.parse(sessionStorage.getItem('auth') || '{}');
  const school = auth.schoolCode || "mpjh11243";
  
  async function refresh(){ 
    const r=await fetch(`/api/state?school=${school}`, {
      headers: auth.token ? { 'Authorization': `Bearer ${auth.token}` } : {}
    }); 
    const j=await r.json(); 
    setRemaining(j.remaining); 
    setArrived(j.arrived); 
  }
  
  useEffect(()=>{ 
    // Check for either token (new auth) or pin (old auth)
    if (!auth.token && !auth.pin) {
      window.location.href = '/signin';
      return;
    }
    refresh(); 
  },[]);
  
  async function arrive(bus_no:string){
    await fetch(`/api/arrive?school=${school}`, { 
      method:"POST", 
      headers:{ "content-type":"application/json"}, 
      body: JSON.stringify({ bus_no }) 
    });
    refresh();
  }

  async function unarrive(bus_no:string){
    await fetch(`/api/unarrive?school=${school}`, { 
      method:"POST", 
      headers:{ "content-type":"application/json"}, 
      body: JSON.stringify({ bus_no }) 
    });
    setConfirmRemove(null);
    refresh();
  }

  async function addBus(markArrived: boolean = false) {
    if (!newBusNumber.trim()) return;
    
    // Add bus to the list
    const currentBuses = await fetch(`/api/state?school=${school}`).then(r => r.json());
    const allBuses = [...currentBuses.remaining, ...currentBuses.arrived.map((a:any) => ({ bus_no: a.bus_no }))];
    
    if (!allBuses.find(b => b.bus_no === newBusNumber)) {
      const updatedBuses = [...allBuses, { bus_no: newBusNumber, display_name: `Bus ${newBusNumber}` }];
      await fetch(`/api/admin/buses?school=${school}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ buses: updatedBuses })
      });
    }
    
    // Mark as arrived if requested
    if (markArrived) {
      await arrive(newBusNumber);
    }
    
    setNewBusNumber("");
    setShowAddBus(false);
    refresh();
  }

  async function updateArrivalTime() {
    if (!editingTime || !newTime) return;
    
    const [hours, minutes] = newTime.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    const ts_utc = Math.floor(date.getTime() / 1000);
    
    await fetch(`/api/update-time?school=${school}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ 
        bus_no: editingTime.bus_no,
        ts_utc: ts_utc
      })
    });
    
    setEditingTime(null);
    setNewTime("");
    refresh();
  }

  async function archiveDay() {
    setArchiveStatus('saving');
    
    try {
      const response = await fetch(`/api/done?school=${school}`, { method: 'POST' });
      if (response.ok) {
        setArchiveStatus('complete');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        alert('Failed to archive. Please try again.');
        setArchiveStatus('idle');
      }
    } catch (error) {
      alert('Network error. Please check your connection.');
      setArchiveStatus('idle');
    }
  }
  
  return (
    <div className="app-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <header className="header" style={{ 
        padding: '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/logo.png" alt="BusDuty" className="header-logo-img" style={{ height: '40px' }} />
          <h1 className="header-title" style={{ fontSize: '1.25rem' }}>
            BusDuty<span style={{ fontSize: '0.7em', opacity: 0.8 }}>.com</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {auth.token && (
            <button 
              onClick={() => { window.location.href = '/account'; }}
              style={{
                padding: '0.5rem 1rem',
                background: 'transparent',
                border: '2px solid #FFC107',
                color: '#2C3E50',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
              Account
            </button>
          )}
          <button 
            onClick={() => { 
              sessionStorage.removeItem('auth');
              window.location.href = '/'; 
            }}
            style={{
              padding: '0.5rem 1rem',
              background: '#E0E0E0',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}
          >
            {auth.token ? 'Sign Out' : 'Exit'}
          </button>
        </div>
      </header>
      
      <main className="main-content" style={{ padding: '1rem' }}>
        <h2 className="section-title" style={{ 
          fontSize: '1.1rem', 
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          Tap When Bus Arrives
        </h2>
        
        <div className="bus-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '0.75rem',
          marginBottom: '2rem'
        }}>
          {remaining.map(b=>(
            <button 
              key={b.bus_no} 
              onClick={()=>arrive(b.bus_no)} 
              className="bus-button"
              style={{
                background: '#FFC107',
                color: '#2C3E50',
                border: 'none',
                borderRadius: '12px',
                padding: '1.25rem 0.75rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                touchAction: 'manipulation'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🚌</span>
              <span>{b.display_name || `Bus ${b.bus_no}`}</span>
            </button>
          ))}
          {/* Add Bus Card - Always show */}
          <button 
            onClick={() => setShowAddBus(true)}
            className="bus-button"
            style={{
              background: 'white',
              color: '#2C3E50',
              border: '2px dashed #FFC107',
              borderRadius: '12px',
              padding: '1.25rem 0.75rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              touchAction: 'manipulation'
            }}
          >
            <span style={{ fontSize: '2rem' }}>+</span>
            <span>Add Bus</span>
          </button>
        </div>
        
        {remaining.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '1rem',
            color: '#666',
            marginBottom: '1rem',
            background: '#E8F5E9',
            borderRadius: '8px'
          }}>
            All regular buses have arrived! 🎉
          </div>
        )}

        <div style={{ 
          background: 'white',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 className="section-title" style={{ 
            fontSize: '1.1rem', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ color: '#4CAF50' }}>✅</span> Arrived Buses
          </h2>
          
          {arrived.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {arrived.map(a=>(
                <li key={a.bus_no+""+a.ts_utc} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem',
                  borderBottom: '1px solid #E0E0E0',
                  gap: '0.5rem'
                }}>
                  <img 
                    src="/logo.png" 
                    alt="" 
                    style={{ 
                      height: '20px', 
                      width: 'auto',
                      marginRight: '0.5rem'
                    }} 
                  />
                  <span style={{ 
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    minWidth: '80px'
                  }}>
                    Bus {a.bus_no}
                  </span>
                  <button
                    onClick={() => {
                      const date = new Date(a.ts_utc * 1000);
                      setNewTime(`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`);
                      setEditingTime({ bus_no: a.bus_no, current_time: a.ts_utc });
                    }}
                    style={{ 
                      color: '#666',
                      fontSize: '0.9rem',
                      flex: 1,
                      textAlign: 'center',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    {new Date(a.ts_utc*1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </button>
                  <button
                    onClick={() => setConfirmRemove(a.bus_no)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      padding: '0 0.5rem'
                    }}
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '1.5rem',
              color: '#999'
            }}>
              No buses have arrived yet
            </div>
          )}
        </div>

        {/* Done for the Day Button */}
        <button
          onClick={() => setShowDoneConfirm(true)}
          style={{
            width: '100%',
            marginTop: '2rem',
            padding: '1rem',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          Done for the Day
        </button>
      </main>

      {/* Confirmation Modal */}
      {confirmRemove && (
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
            padding: '1.5rem',
            maxWidth: '90%',
            width: '350px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
              Remove Bus {confirmRemove}?
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              This will move the bus back to the arrival queue.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setConfirmRemove(null)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#E0E0E0',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => unarrive(confirmRemove)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold'
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Bus Modal */}
      {showAddBus && (
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
            padding: '1.5rem',
            maxWidth: '90%',
            width: '350px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
              Add New Bus
            </h3>
            <input
              type="text"
              placeholder="Enter bus number"
              value={newBusNumber}
              onChange={(e) => setNewBusNumber(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addBus(false);
                }
              }}
              autoFocus
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '2px solid #E0E0E0',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => addBus(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#FFC107',
                    color: '#2C3E50',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold'
                  }}
                >
                  Add to List
                </button>
                <button
                  onClick={() => addBus(true)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold'
                  }}
                >
                  Add & Arrived
                </button>
              </div>
              <button
                onClick={() => {
                  setShowAddBus(false);
                  setNewBusNumber("");
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#E0E0E0',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Time Modal */}
      {editingTime && (
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
            padding: '1.5rem',
            maxWidth: '90%',
            width: '350px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
              Edit Arrival Time - Bus {editingTime.bus_no}
            </h3>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1.2rem',
                border: '2px solid #E0E0E0',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setEditingTime(null);
                  setNewTime("");
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#E0E0E0',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const now = new Date();
                  setNewTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#FFC107',
                  color: '#2C3E50',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              >
                Now
              </button>
              <button
                onClick={updateArrivalTime}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Done for the Day Confirmation Modal */}
      {showDoneConfirm && (
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
            padding: '1.5rem',
            maxWidth: '90%',
            width: '350px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            {archiveStatus === 'idle' ? (
              <>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
                  Done for the Day?
                </h3>
                <p style={{ marginBottom: '1.5rem', color: '#666' }}>
                  This will archive today's arrival data and clear the board for tomorrow.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      setShowDoneConfirm(false);
                      setArchiveStatus('idle');
                    }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: '#E0E0E0',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 'bold'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={archiveDay}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 'bold'
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </>
            ) : archiveStatus === 'saving' ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  border: '4px solid #E0E0E0',
                  borderTopColor: '#4CAF50',
                  borderRadius: '50%',
                  margin: '0 auto 1.5rem',
                  animation: 'spin 1s linear infinite'
                }}>
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                  Saving to Cloud...
                </h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  Archiving today's data
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>
                  ✅
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#4CAF50' }}>
                  Complete!
                </h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  Data archived successfully
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}