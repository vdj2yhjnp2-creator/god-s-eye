import { useEffect, useState } from 'react'
import { Activity, Aperture, Bell, Camera, ChevronRight, Crosshair, Database, Eye, Globe2, LockKeyhole, Map, Menu, Radio, Search, Shield, Smartphone, Terminal, Wifi, X } from 'lucide-react'

type EventItem = { id: string; title: string; category: string; details: string; created_at: string; source: string }
const initialEvents: EventItem[] = [
  { id:'e1', title:'GE-001 workspace initialized', category:'system', details:'Dashboard locale avviata. Nessuna sorgente esterna collegata.', created_at:new Date().toISOString(), source:'system' },
  { id:'e2', title:'Security perimeter', category:'system', details:'Modalità privata richiesta. Autenticazione di produzione da configurare.', created_at:new Date(Date.now()-3600000).toISOString(), source:'system' },
  { id:'e3', title:'Map layers ready', category:'location', details:'Selettore cartografia tattica / satellite disponibile. Tile provider non configurato.', created_at:new Date(Date.now()-7200000).toISOString(), source:'system' }
]
const nav = [
  {name:'Overview', icon:Activity}, {name:'Global Map', icon:Globe2}, {name:'Intelligence', icon:Database},
  {name:'Devices', icon:Smartphone}, {name:'Surveillance', icon:Camera}, {name:'AI Analyst', icon:Aperture},
  {name:'Operations', icon:Crosshair}, {name:'Connection Graph', icon:Radio}, {name:'Data Vault', icon:LockKeyhole}
]
export default function App() {
  const [active, setActive] = useState('Overview')
  const [mapMode, setMapMode] = useState<'TACTICAL'|'SATELLITE'>('TACTICAL')
  const [events, setEvents] = useState<EventItem[]>(initialEvents)
  const [apiStatus, setApiStatus] = useState('CHECKING')
  const [query, setQuery] = useState('')
  const [mobileNav, setMobileNav] = useState(false)

  useEffect(() => {
    fetch('/api/health').then(r => r.ok ? r.json() : Promise.reject()).then(() => setApiStatus('ONLINE')).catch(() => setApiStatus('OFFLINE'))
    fetch('/api/events').then(r => r.ok ? r.json() : Promise.reject()).then(d => { if (d.items?.length) setEvents(d.items) }).catch(() => {})
  }, [])

  const visibleEvents = events.filter(e => `${e.title} ${e.details} ${e.category}`.toLowerCase().includes(query.toLowerCase()))
  const addDemoEvent = async () => {
    const payload = {title:'Manual system check', category:'system', details:'Evento di test creato dalla dashboard GE-001.'}
    try {
      const r = await fetch('/api/events', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)})
      if (!r.ok) throw new Error()
      const item = await r.json(); setEvents(prev => [item, ...prev])
    } catch {
      setEvents(prev => [{id:crypto.randomUUID(), ...payload, created_at:new Date().toISOString(), source:'local-demo'}, ...prev])
    }
  }

  return <div className="shell">
    <aside className={`sidebar ${mobileNav?'open':''}`}>
      <div className="brand"><div className="brand-mark"><Eye size={21}/></div><div><b>GOD'S EYE</b><small>GLOBAL INTELLIGENCE</small></div><button className="mobile-close" onClick={()=>setMobileNav(false)}><X size={18}/></button></div>
      <div className="side-label">COMMAND MENU</div>
      <nav>{nav.map(({name,icon:Icon})=><button key={name} className={`nav-item ${active===name?'selected':''}`} onClick={()=>{setActive(name);setMobileNav(false)}}><Icon size={17}/><span>{name}</span>{name==='Overview'&&<i/>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="secure"><Shield size={16}/><div><b>PRIVATE WORKSPACE</b><small>Access controls pending setup</small></div></div><div className="version">GE-001 <span>BUILD 0.1.0</span></div></div>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="menu-btn" onClick={()=>setMobileNav(true)}><Menu/></button>
        <div className="breadcrumb">COMMAND CENTER <ChevronRight size={13}/> <strong>{active.toUpperCase()}</strong></div>
        <div className="top-actions"><div className="status"><span className={apiStatus==='ONLINE'?'green':'amber'}/>{apiStatus==='ONLINE'?'API CONNECTED':apiStatus==='OFFLINE'?'API DISCONNECTED':'CONNECTING'}</div><button className="icon-btn" aria-label="Notifications"><Bell size={17}/></button><div className="avatar">GE</div></div>
      </header>

      <div className="content">
        <div className="page-heading"><div><div className="eyebrow">PERSONAL INTELLIGENCE PLATFORM / GE-001</div><h1>{active==='Overview'?'Command Overview':active}</h1><p>Situational awareness · Verified sources · Private operations</p></div><div className="live-chip"><span/> SYSTEM NOMINAL</div></div>

        <section className="stats">
          <div className="stat-card"><div className="stat-top"><span>REGISTERED DEVICES</span><Smartphone/></div><b>00</b><small>No devices connected</small></div>
          <div className="stat-card"><div className="stat-top"><span>ACTIVE SOURCES</span><Database/></div><b>00</b><small>Connect an authorized source</small></div>
          <div className="stat-card"><div className="stat-top"><span>CAMERA FEEDS</span><Camera/></div><b>00</b><small>No camera feeds configured</small></div>
          <div className="stat-card"><div className="stat-top"><span>OPEN ALERTS</span><Bell/></div><b>00</b><small>No active alerts</small></div>
        </section>

        <section className="workspace-grid">
          <div className="panel map-panel">
            <div className="panel-head"><div><span className="panel-kicker">GEOSPATIAL MONITOR</span><h2>Global Map</h2></div><div className="map-switch"><button className={mapMode==='TACTICAL'?'active':''} onClick={()=>setMapMode('TACTICAL')}>TACTICAL</button><button className={mapMode==='SATELLITE'?'active':''} onClick={()=>setMapMode('SATELLITE')}>SATELLITE</button></div></div>
            <div className={`map-placeholder ${mapMode.toLowerCase()}`}>
              <div className="map-grid"/><div className="map-watermark"><Globe2 size={50}/><b>{mapMode} VIEW</b><span>{mapMode==='SATELLITE'?'SATELLITE TILE PROVIDER NOT CONFIGURED':'TACTICAL OVERLAY / DEMO'}</span></div>
              <div className="coord coord-a">LAT 45° 27' 00" N<br/>LON 8° 37' 00" E</div><div className="coord coord-b">GRID // GE-001</div>
              <div className="map-cross"><Crosshair size={25}/></div>
              <div className="map-legend"><span/><span>DEMO LAYER</span><span className="legend-muted">NO LIVE TRACKING</span></div>
            </div>
            <div className="map-foot"><span><Map size={14}/> MAP ENGINE: AWAITING TILE CONFIGURATION</span><span>LAYERS <b>01</b></span></div>
          </div>

          <div className="right-stack">
            <div className="panel quick-panel"><div className="panel-head"><div><span className="panel-kicker">SYSTEM ACCESS</span><h2>Quick Actions</h2></div><Terminal size={17}/></div>
              <button className="action-row" onClick={()=>setActive('Global Map')}><Globe2/><span><b>Open Global Map</b><small>Geospatial workspace</small></span><ChevronRight/></button>
              <button className="action-row" onClick={()=>setActive('Devices')}><Smartphone/><span><b>Register Device</b><small>Owner-authorized device setup</small></span><ChevronRight/></button>
              <button className="action-row" onClick={()=>setActive('Intelligence')}><Search/><span><b>New Intelligence Record</b><small>Document a public source</small></span><ChevronRight/></button>
              <button className="action-row" onClick={()=>setActive('Surveillance')}><Camera/><span><b>Configure Camera</b><small>Authorized IP camera only</small></span><ChevronRight/></button>
            </div>
            <div className="panel integrity"><div className="panel-head"><div><span className="panel-kicker">SECURITY POSTURE</span><h2>Integrity Status</h2></div><Shield size={17}/></div><div className="integrity-line"><span>Transport security</span><b className="pending">DEPLOYMENT PENDING</b></div><div className="integrity-line"><span>Multi-factor auth</span><b className="pending">NOT CONFIGURED</b></div><div className="integrity-line"><span>Audit logging</span><b className="good">LOCAL EVENTS</b></div></div>
          </div>
        </section>

        <section className="panel events-panel"><div className="panel-head"><div><span className="panel-kicker">ACTIVITY STREAM</span><h2>Recent Events</h2></div><div className="event-tools"><div className="searchbox"><Search size={14}/><input placeholder="Filter events..." value={query} onChange={e=>setQuery(e.target.value)}/></div><button className="small-button" onClick={addDemoEvent}>+ LOG EVENT</button></div></div>
          <div className="events-list">{visibleEvents.length?visibleEvents.map(e=><div className="event" key={e.id}><div className="event-icon"><Activity size={15}/></div><div className="event-copy"><b>{e.title}</b><span>{e.details}</span></div><div className="event-meta"><span>{e.category.toUpperCase()}</span><time>{new Date(e.created_at).toLocaleString()}</time></div></div>):<div className="empty">No matching events.</div>}</div>
        </section>
        <footer><span>GOD'S EYE GE-001</span><span>DEVELOPMENT ENVIRONMENT · DEMO DATA ONLY</span><span><Wifi size={13}/> {apiStatus}</span></footer>
      </div>
    </main>
  </div>
}
