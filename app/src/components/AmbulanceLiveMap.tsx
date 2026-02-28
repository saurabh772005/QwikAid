import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEmergencyStore } from '@/stores';
import { Ambulance, Maximize2, Minimize2, Phone, ShieldCheck, Activity, Star, CheckCircle2, Circle, MapPin, Wifi, Layers, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
const patientIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const hospitalIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div class="w-5 h-5 bg-green-500 rounded-sm border-2 border-white shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const ambulanceIconHTML = `<div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-[0_0_20px_rgba(239,68,68,0.8)]"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10H6"/><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11h11l4-4.5c.54-.6 1.34-1.5 2.71-1.5h3.29a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2.28c-.35 1.71-1.83 3-3.72 3s-3.37-1.29-3.72-3H20"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg></div>`;

const ambulanceIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: ambulanceIconHTML,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

function MapUpdater() {
  const map = useMap();
  const { ambulanceLocation } = useEmergencyStore();
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!ambulanceLocation) return;
    const { lat, lng, startLat, startLng, endLat, endLng } = ambulanceLocation;

    if (!markerRef.current) {
      markerRef.current = L.marker([startLat, startLng], { icon: ambulanceIcon }).addTo(map);

      const bounds = L.latLngBounds(
        [startLat, startLng],
        [endLat, endLng]
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      map.panTo([lat, lng], { animate: true, duration: 1 });
    }
  }, [ambulanceLocation, map]);

  return null;
}

export default function AmbulanceLiveMap() {
  const { ambulanceLocation, ambulanceEta, incidentLogs, assignedAmbulance, selectedHospital, currentStage, userLocation } = useEmergencyStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!ambulanceLocation) return null;

  // Use the current real-time user location if available, otherwise fall back to the case destination
  const patientLat = userLocation?.lat || ambulanceLocation.endLat;
  const patientLng = userLocation?.lng || ambulanceLocation.endLng;

  const formatETA = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const distanceLeft = ambulanceEta ? (ambulanceEta * 0.011).toFixed(1) : '0.0';

  const mapComponent = (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900' : 'w-full h-auto flex flex-col lg:flex-row gap-6 mt-4 relative'}`}>

      {/* Background Cover Overlay for aesthetic when in fullscreen */}
      {isFullscreen && (
        <div className="absolute inset-0 pointer-events-none z-[40]">
          {/* Center Crosshair Art */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <div className="w-[400px] h-[400px] rounded-full border border-slate-700/50 flex items-center justify-center">
              <div className="w-[200px] h-[200px] rounded-full border border-slate-700"></div>
              <div className="absolute w-full h-[1px] bg-slate-700/80"></div>
              <div className="absolute h-full w-[1px] bg-slate-700/80"></div>
            </div>
          </div>
        </div>
      )}

      {/* MAP AREA */}
      <div className={`${isFullscreen ? 'absolute inset-0 z-10' : 'flex-1 h-[400px] lg:h-auto rounded-2xl overflow-hidden border border-slate-800 relative shadow-2xl shadow-blue-500/10'}`}>
        <MapContainer
          center={[ambulanceLocation.startLat, ambulanceLocation.startLng]}
          zoom={13}
          style={{ height: '100%', width: '100%', background: isFullscreen ? '#64748b' : '#0f172a' }} // Using a lighter slate mix for the styled appearance
          zoomControl={false}
          attributionControl={false}
        >
          {isFullscreen ? (
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              className="map-tiles-custom-filter" // We'll add custom CSS to invert and hue shift if needed, or stick to dark map.
            />
          ) : (
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          )}

          <Marker position={[ambulanceLocation.startLat, ambulanceLocation.startLng]} icon={hospitalIcon} />
          <Marker position={[patientLat, patientLng]} icon={patientIcon} />

          <Polyline
            positions={[
              [ambulanceLocation.startLat, ambulanceLocation.startLng],
              [patientLat, patientLng]
            ]}
            pathOptions={{
              color: '#3b82f6',
              weight: 4,
              dashArray: '10, 10',
              opacity: 0.8,
              className: 'animate-pulse'
            }}
          />
          <MapUpdater />
        </MapContainer>

        {!isFullscreen && (
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] px-6 py-3 bg-slate-900 border border-slate-700 hover:bg-slate-800 hover:border-slate-500 text-white font-bold rounded-full shadow-2xl flex items-center gap-2 transition-all"
          >
            <Maximize2 className="w-5 h-5" /> Live Track
          </button>
        )}
      </div>

      {/* OVERLAY UI FOR FULLSCREEN (Matches User Screenshot precisely) */}
      {isFullscreen ? (
        <div className="absolute inset-0 pointer-events-none z-[100] p-6 lg:p-8 flex justify-between h-full bg-slate-900/40">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6 w-[360px] pointer-events-auto h-full pr-2 overflow-y-auto hide-scrollbar">

            {/* Hospital Matching Progress */}
            <div className="bg-slate-700/30 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-white font-bold text-lg">Hospital Matching</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full">Step 1 of 2</span>
              </div>

              <div className="space-y-6 relative pl-3">
                <div className="absolute left-[20px] top-4 bottom-6 w-[2px] bg-gradient-to-b from-green-500 via-slate-600 to-slate-700 rounded-full z-0"></div>

                <div className="relative z-10 flex gap-4">
                  <div className="w-5 h-5 rounded-full bg-slate-800 border border-green-500 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium">Searching within 5km...</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Completed • Found 2 facilities</p>
                  </div>
                </div>

                <div className="relative z-10 flex gap-4">
                  <div className="w-5 h-5 rounded-full bg-slate-800 border border-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-3 h-3 border-2 border-t-blue-400 border-r-blue-400 border-b-transparent border-l-transparent rounded-full animate-spin"></span>
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium">Extending to 10km...</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">In Progress • Optimizing for ICU beds</p>
                  </div>
                </div>

                <div className="relative z-10 flex gap-4">
                  <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Circle className="w-2.5 h-2.5 text-slate-500 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-slate-500 text-sm font-medium">Finalizing Match</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">Waiting for response</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Hospital Card */}
            <div className="bg-slate-700/30 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-white font-bold text-[1.1rem]">{selectedHospital?.name || "Aakash Healthcare Super Speciality Hospital, Dwarka"}</h3>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1.5"><MapPin className="w-3.5 h-3.5" /> {selectedHospital?.distance || '4.2'} km away</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300 bg-blue-500/30 px-3 py-1 rounded-md">Primary Match</span>
                </div>

                <div className="flex gap-4 mb-5">
                  <div className="flex-1 bg-slate-800/80 rounded-xl p-4 border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold select-none">Available Beds</p>
                    <p className="text-3xl font-bold text-emerald-400">{selectedHospital?.availableBeds || 12}</p>
                  </div>
                  <div className="flex-1 bg-slate-800/80 rounded-xl p-4 border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold select-none">Trauma Level</p>
                    <p className="text-xl font-bold text-white mt-1">Level I</p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <span className="text-[10px] text-red-300 font-bold bg-red-950/40 px-3 py-1.5 flex items-center gap-1.5 rounded-lg border border-red-500/20"><Activity className="w-3 h-3 text-red-400" /> ICU READY</span>
                  <span className="text-[10px] text-blue-300 font-bold bg-blue-950/40 px-3 py-1.5 flex items-center gap-1.5 rounded-lg border border-blue-500/20"><CheckCircle2 className="w-3 h-3 text-blue-400" /> CT SCAN</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col justify-between gap-6 w-[380px] pointer-events-auto h-full">
            {/* Ambulance Dispatch Card */}
            <div className="bg-slate-700/30 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden shrink-0">
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-white font-bold text-lg">Ambulance Dispatch</h3>
                <Wifi className="w-5 h-5 text-blue-500 animate-pulse" />
              </div>

              <div className="bg-slate-800/80 rounded-2xl p-6 text-center mb-6 shadow-inner border border-white/5 relative z-10">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3 select-none">Estimated Arrival</p>
                <div className="text-6xl text-blue-400 font-bold tracking-tighter mb-3 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">{formatETA(ambulanceEta || 0)}</div>
                <p className="text-emerald-400 text-[11px] flex items-center justify-center gap-1 font-medium select-none text-center"><MapPin className="w-3.5 h-3.5" /> {distanceLeft} km distance left</p>
              </div>

              <div className="flex items-center gap-4 bg-slate-800/80 rounded-[1.25rem] p-4 mb-6 border border-white/5 relative z-10 hover:bg-slate-800 transition cursor-pointer group">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${assignedAmbulance?.driverName?.replace(' ', '') || 'Rajesh'}`} className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-700 shadow-sm" />
                <div className="flex-1">
                  <h4 className="text-white font-bold text-[15px]">{assignedAmbulance?.driverName || 'Rajesh Kumar'}</h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">Expert Driver • 4.9 <Star className="w-3 h-3 text-yellow-500 fill-current" /></p>
                </div>
                <button className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors border border-blue-500/20"><Phone className="w-4 h-4 text-blue-400" /></button>
              </div>

              <div className="space-y-4 mb-7 text-xs relative z-10 px-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium select-none">Vehicle Number</span>
                  <span className="bg-slate-950 text-white font-mono px-2.5 py-1.5 rounded-lg border border-slate-700 font-bold shadow-inner tracking-wider">{assignedAmbulance?.vehicleNumber || 'KA-01-AM-2024'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium select-none">Vehicle Type</span>
                  <span className="text-slate-300 font-medium">ALS Ambulance (Type D)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium select-none">Status</span>
                  <span className="flex items-center gap-1.5 text-blue-400 font-bold"><span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span> En-route to Pickup</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.5)] active:scale-[0.98] select-none text-sm relative z-10">
                BROADCAST EMERGENCY
              </button>
            </div>

            {/* Live Incident Log Container */}
            <div className="bg-slate-700/30 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl shrink-0">
              <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4 flex items-center gap-2 select-none"><ShieldCheck className="w-3 h-3 text-slate-400" /> LIVE INCIDENT LOG</h3>
              <div className="space-y-4 text-[11px] font-mono relative pl-4 border-l-2 border-slate-700">
                <div className="relative text-slate-400">
                  <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full border-2 bg-slate-900 border-slate-500"></div>
                  Ambulance assigned to incident #882
                </div>
                <div className="relative text-slate-400">
                  <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full border-2 bg-slate-900 border-slate-500"></div>
                  Aakash Healthcare confirmed bed availability
                </div>
                <div className="relative text-blue-400 font-medium">
                  <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full border-2 bg-slate-900 border-blue-500"></div>
                  Route optimized for traffic bypass
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM CONTROL PILL */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center bg-slate-700/30 backdrop-blur-3xl border border-white/10 rounded-full p-1.5 shadow-2xl pointer-events-auto">
            <button onClick={() => setIsFullscreen(false)} className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-colors shadow-md">
              <Minimize2 className="w-4 h-4" /> Exit Live Track
            </button>
            <div className="w-px h-5 bg-white/10 mx-2"></div>
            <button className="p-2.5 hover:bg-white/10 rounded-full transition-colors"><Layers className="w-4 h-4 text-slate-300" /></button>
            <button className="p-2.5 hover:bg-white/10 rounded-full transition-colors"><ZoomIn className="w-4 h-4 text-slate-300" /></button>
            <button className="p-2.5 hover:bg-white/10 rounded-full transition-colors"><ZoomOut className="w-4 h-4 text-slate-300" /></button>
          </div>
        </div>
      ) : (
        /* NORMAL INLINE UI (Right Panel) */
        <div className="w-full lg:w-[360px] flex flex-col gap-6">
          {/* ETA Section */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 relative overflow-hidden shrink-0 shadow-lg">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
              <Ambulance className="w-4 h-4 text-blue-400" /> Estimated Arrival
            </h3>
            <div className="text-6xl font-mono font-bold text-white tracking-tight drop-shadow-md py-2">
              {ambulanceEta !== null ? formatETA(ambulanceEta) : '--:--'}
            </div>
            <p className="text-emerald-400 text-sm mt-1 flex items-center gap-1.5 font-medium"><MapPin className="w-4 h-4" /> {distanceLeft} km remaining</p>
          </div>

          {/* Driver Section */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 shrink-0 shadow-lg">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 bg-slate-700 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden shadow-inner border border-slate-600">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${assignedAmbulance?.driverName?.replace(' ', '') || 'Rajesh'}`} alt="Driver" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold text-lg">{assignedAmbulance?.driverName || 'Rajesh Kumar'}</h4>
                <p className="text-gray-400 text-sm flex items-center gap-1">Expert Driver • 4.9 <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" /></p>
              </div>
              <button className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center hover:bg-blue-500/20 transition shadow-lg shrink-0">
                <Phone className="w-5 h-5 text-blue-400" />
              </button>
            </div>

            <div className="space-y-3 mt-5 pt-5 border-t border-slate-700/50 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Vehicle Number</span>
                <span className="text-white font-mono bg-slate-950 px-3 py-1 rounded-md text-xs border border-slate-800 shadow-inner">{assignedAmbulance?.vehicleNumber || 'KA-01-AM-2024'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Vehicle Type</span>
                <span className="text-gray-300 font-medium">ALS Ambulance (Type D)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Status</span>
                <span className="text-blue-400 flex items-center gap-2 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span> {ambulanceEta === 0 ? 'Arrived' : 'En-route to Pickup'}</span>
              </div>
            </div>
          </div>

          {/* Live Incident Log */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 flex-1 flex flex-col min-h-[220px] shadow-lg">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Live Incident Log
            </h3>
            <div className="flex-1 overflow-y-auto pr-3 space-y-4 font-mono text-xs">
              <AnimatePresence>
                {incidentLogs.map((log, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i}
                    className={`pb-4 pl-3 border-l-2 ${i !== incidentLogs.length - 1 ? 'border-slate-700' : 'border-blue-500'} ${i === incidentLogs.length - 1 ? 'text-blue-400 font-medium' : 'text-gray-400'}`}
                  >
                    <div className="relative -left-[21px] top-0 w-2 h-2 rounded-full bg-slate-900 border-2 border-slate-500 mb-[-8px]"></div>
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return isFullscreen ? (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-slate-950"
      >
        {mapComponent}
      </motion.div>
    </AnimatePresence>
  ) : (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, type: 'spring' }}
      className={`w-full ${currentStage < 5 ? 'mt-6' : 'mt-0'}`}
    >
      {mapComponent}
    </motion.div>
  );
}
