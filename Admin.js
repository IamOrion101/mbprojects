   1  import React, { useEffect, useState } from 'react';
     2  import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
     3  import L from 'leaflet';
     4  import 'leaflet/dist/leaflet.css';
     5  import { adminAPI } from '../api'; // Pointing to your 170.9.224.115 IP
     6
     7  // --- CUSTOM ICONS ---
     8  const truckIcon = new L.Icon({
     9      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
    10      iconSize: [35, 35],
    11      iconAnchor: [17, 35],
    12      popupAnchor: [0, -35],
    13  });
    14  const trailerIcon = new L.Icon({
    15      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2891/2891444.png',
    16      iconSize: [45, 45],
    17      iconAnchor: [22, 45],
    18      popupAnchor: [0, -45],
    19  });
    20  const AdminDashboard = () => {
    21    const [fleet, setFleet] = useState([]);
    22    const [loading, setLoading] = useState(true);
    23
    24    // 1. FETCH FROM DATABASE
    25    const fetchGodView = async () => {
    26      try {
    27        const data = await adminAPI.getGodView();
    28        setFleet(Array.isArray(data) ? data : []);
    29        setLoading(false);
    30      } catch (err) {
    31        console.error("Fetch Error:", err.message);
    32        setLoading(false);
    33      }
    34    };
    35    useEffect(() => {
    36      fetchGodView();
    37      const interval = setInterval(fetchGodView, 5000);
    38      return () => clearInterval(interval);
    39    }, []);
    40
    41    // 2. TOGGLE DATABASE RECORD
    42    const toggleTrailerMode = async (driverId, currentIsTrailer) => {
    43      if (!driverId) return;
    44      const targetStatus = !currentIsTrailer;
    45
    46      try {
    47        const response = await fetch(`http://170.9.224.115:5000/api/admin/trailers/toggle/${driverId}`, {
    48          method: 'PUT',
    49          headers: {
    50            'Content-Type': 'application/json',
    51            'Authorization': `Bearer ${localStorage.getItem('token')}`
    52          },
    53          body: JSON.stringify({ active_status: targetStatus })
    54        });
    55
    56        const data = await response.json();
    57        if (data.success) {
    58          console.log("✅ Database record updated!");
    59          fetchGodView();
    60        }
    61      } catch (err) {
    62        console.error("🚨 DB Connection Error:", err.message);
    63      }
    64    };
    65
    66    // 3. CALCULATIONS
    67    const totalRevenue = (fleet || []).reduce((sum, job) => {
    68      const val = String(job.price_zar || '0').replace(/[^0-9.]/g, '');
    69      return sum + (parseFloat(val) || 0);
    70    }, 0);
    71
    72    const uniqueFleet = fleet || [];
    73
    74    // 4. LOADING STATE
    75    if (loading) {
    76      return <div className="h-screen bg-gray-900 text-yellow-500 flex items-center justify-center font-black italic">LOADING ANDROMEDA...</div>;
    77    }
    78  return (
    79    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', backgroundColor: '#111827' }}>
    80      {/* HEADER */}
    81
    82      <header style={{ height: '60px', backgroundColor: '#1f2937', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid #374151', zIndex: 1000 }}>
    83        <h1 style={{ fontWeight: '900', color: '#eab308', margin: 0 }}>ANDROMEDA GOD VIEW</h1>
    84        <div style={{ textAlign: 'right' }}>
    85          <div style={{ fontSize: '10px', color: '#9ca3af' }}>TOTAL REVENUE</div>
    86          <div style={{ fontWeight: 'bold', color: '#4ade80' }}>R {totalRevenue.toFixed(2)}</div>
    87        </div>
    88      </header>
    89
    90      {/* MAIN CONTENT */}
    91      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
    92
    93        {/* LEFT: THE MAP */}
    94        <div style={{ flex: 3, position: 'relative', backgroundColor: '#000' }}>
    95          <MapContainer
    96            center={[-26.2041, 28.0473]}
    97            zoom={10}
    98            style={{ height: '100%', width: '100%' }}
    99          >
   100            <TileLayer
   101              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
   102              attribution='&copy; OpenStreetMap'
   103            />
   104            {fleet.map((driver, index) => {
   105              const lat = (driver.lat && driver.lat !== 0) ? driver.lat : -26.2041;
   106              const lng = (driver.lng && driver.lng !== 0) ? driver.lng : 28.0473;
   107              const isT = driver.has_trailer === true || String(driver.has_trailer).toLowerCase() === 't';
   108              return (
   109                <Marker key={`map-${driver.id}-${index}`} position={[lat, lng]} icon={isT ? trailerIcon : truckIcon}>
   110                  <Popup><b>{driver.driver_name || driver.full_name}</b></Popup>
   111                </Marker>
   112              );
   113            })}
   114          </MapContainer>
   115        </div>
   116
   117        {/* RIGHT: SIDEBAR */}
   118        <aside style={{ flex: 1, backgroundColor: '#1f2937', padding: '20px', overflowY: 'auto', borderLeft: '1px solid #374151', color: 'white' }}>
   119          <h2 style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '20px' }}>
   120            Active Fleet ({fleet.length})
   121          </h2>
   122          {fleet.map((driver, index) => {
   123            const isT = driver.has_trailer === true || String(driver.has_trailer).toLowerCase() === 't';
   124            return (
   125              <div key={`side-${driver.id}-${index}`} style={{ backgroundColor: 'rgba(55, 65, 81, 0.5)', padding: '15px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #4b5563' }}>
   126                <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>{driver.driver_name || driver.full_name}</div>
   127                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
   128                  <span style={{ color: '#eab308', fontWeight: 'bold' }}>R{driver.price_zar || '0.00'}</span>
   129                  <button
   130                    onClick={() => toggleTrailerMode(driver.id, isT)}
   131                    style={{ backgroundColor: isT ? '#dc2626' : '#eab308', color: isT ? 'white' : 'black', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }}
   132                  >
   133                    {isT ? 'REMOVE TRAILER' : 'ADD TRAILER'}
   134                  </button>
   135                </div>
   136              </div>
   137            );
   138          })}
   139        </aside>
   140      </div>
   141    </div>
   142  );
   143  }; // <--- ADD THIS BRACE HERE TO CLOSE THE COMPONENT
   144
   145  export default AdminDashboard;
