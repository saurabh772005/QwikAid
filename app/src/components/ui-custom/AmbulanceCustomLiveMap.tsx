import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

// --- ICONS ---
// Start point icon (Hospital in Screenshot)
const startIconHTML = `
  <div style="position: relative; width: max-content;">
    <div style="background: white; border-radius: 20px; padding: 4px 12px 4px 6px; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: 1px solid #e2e8f0;">
      <div style="width: 24px; height: 24px; background: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        <svg fill="white" viewBox="0 0 24 24" width="14" height="14" style="margin-top:1px;"><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"/></svg>
      </div>
      <div style="display: flex; flex-direction: column;">
        <span style="color: #ef4444; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1;">Aakash Hospital</span>
        <span style="color: #64748b; font-size: 11px; font-weight: 500;">(Start)</span>
      </div>
    </div>
    <div style="position: absolute; bottom: -6px; left: 16px; width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid white;"></div>
  </div>
`;

const startMarkerIcon = new L.DivIcon({
    className: 'custom-start-icon',
    html: startIconHTML,
    iconSize: [120, 50],
    iconAnchor: [20, 50]
});

// End point icon (NSUT in Screenshot)
const endIconHTML = `
  <div style="display: flex; flex-direction: column; align-items: center;">
    <div style="display: flex; align-items: center; gap: 6px;">
      <svg width="20" height="24" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
      <div style="display: flex; flex-direction: column;">
        <span style="color: #475569; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1;">NSUT Delhi</span>
        <span style="color: #64748b; font-size: 11px; font-weight: 500;">(Destination)</span>
      </div>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
    </div>
  </div>
`;

const endMarkerIcon = new L.DivIcon({
    className: 'custom-end-icon',
    html: endIconHTML,
    iconSize: [120, 50],
    iconAnchor: [60, 24] // Centered above path
});

// Ambulance Icon matching screenshot
const ambulanceIconHTML = `
  <div style="transform: rotate(15deg); filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
    <div style="width: 48px; height: 24px; background: white; border-radius: 4px; border: 1px solid #cbd5e1; display: flex; overflow: hidden; position: relative;">
      <!-- Body -->
      <div style="width: 60%; background: white; border-right: 2px solid #ef4444; position: relative;">
         <!-- Red stripe -->
         <div style="position: absolute; bottom: 4px; width: 100%; height: 6px; background: #ef4444;"></div>
         <!-- Cross -->
         <div style="position: absolute; top: 4px; left: 6px; width: 8px; height: 2px; background: #ef4444;"></div>
         <div style="position: absolute; top: 1px; left: 9px; width: 2px; height: 8px; background: #ef4444;"></div>
      </div>
      <!-- Cabin -->
      <div style="width: 40%; background: #ef4444; position: relative;">
         <!-- Window -->
         <div style="position: absolute; top: 2px; right: 2px; width: 8px; height: 10px; background: #0f172a; border-radius: 0 4px 0 0;"></div>
      </div>
      <!-- Lights -->
      <div style="position: absolute; top: -3px; left: 50%; transform: translateX(-50%); width: 6px; height: 3px; background: #ef4444; border-radius: 2px 2px 0 0; animation: flash 0.5s infinite alternate;"></div>
      <!-- Wheels -->
      <div style="position: absolute; bottom: -3px; left: 8px; width: 6px; height: 6px; background: #1e293b; border-radius: 50%;"></div>
      <div style="position: absolute; bottom: -3px; right: 8px; width: 6px; height: 6px; background: #1e293b; border-radius: 50%;"></div>
    </div>
  </div>
  <style>
    @keyframes flash { from { box-shadow: 0 0 0 rgba(239,68,68,0); } to { box-shadow: 0 -4px 10px rgba(239,68,68,0.8); } }
  </style>
`;

const ambulanceMovingIcon = new L.DivIcon({
    className: 'custom-ambulance-icon',
    html: ambulanceIconHTML,
    iconSize: [48, 24],
    iconAnchor: [24, 12]
});

// --- HELPER COMPONENT FOR MAP MANIPULATION ---
function MapUpdater({ startUrl, endUrl, currentPos }: { startUrl: [number, number], endUrl: [number, number], currentPos: [number, number] }) {
    const map = useMap();

    useEffect(() => {
        // Fit bounds on mount
        const bounds = L.latLngBounds(startUrl, endUrl);
        map.fitBounds(bounds, { padding: [100, 100], maxZoom: 15 });
    }, [map, startUrl, endUrl]);

    useEffect(() => {
        // Pan smoothly as ambulance moves
        map.panTo(currentPos, { animate: true, duration: 1 });
    }, [currentPos, map]);

    return null;
}

// Ensure distance calculation
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371; // Radius of the earth in km
    var dLat = (lat2 - lat1) * (Math.PI / 180);
    var dLon = (lon2 - lon1) * (Math.PI / 180);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

export default function AmbulanceCustomLiveMap() {
    const [isPlaying, setIsPlaying] = useState(true);

    // Hardcoded coordinates roughly from Aakash to NSUT Delhi based on user request or standard map
    const START_POS: [number, number] = [28.5833, 77.0463]; // Aakash Dwarka
    const END_POS: [number, number] = [28.6091, 77.0350];   // NSUT

    // Generate a mock curved path string or array
    // In a real app we'd use OSRM routing. For this simulation we interpolate points
    const routePoints = useMemo(() => {
        const points: [number, number][] = [];
        const steps = 100;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            // Add a slight curve using a quadratic bezier or simple offset
            const lat = START_POS[0] + (END_POS[0] - START_POS[0]) * t - (Math.sin(t * Math.PI) * 0.005);
            const lng = START_POS[1] + (END_POS[1] - START_POS[1]) * t + (Math.sin(t * Math.PI) * 0.005);
            points.push([lat, lng]);
        }
        return points;
    }, []);

    const [currentIndex, setCurrentIndex] = useState(0); // Start at beginning
    const currentPos = routePoints[currentIndex];

    // Calculate remaining mocked values
    const remainingDist = getDistanceFromLatLonInKm(currentPos[0], currentPos[1], END_POS[0], END_POS[1]);
    const speed = isPlaying ? 52 + Math.floor(Math.random() * 5 - 2) : 0; // Speed fluctuates around 52

    // Simulate ETA based on remaining distance and ~50km/hr average
    const totalSeconds = (remainingDist / 50) * 3600;
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);

    // Animation Loop
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex(prev => {
                if (prev >= routePoints.length - 1) {
                    setIsPlaying(false);
                    clearInterval(interval);
                    return routePoints.length - 1;
                }
                return prev + 1;
            });
        }, 1500); // slightly slower progression

        return () => clearInterval(interval);
    }, [isPlaying, routePoints.length]);

    return (
        <div className="w-full h-full relative font-sans rounded-2xl overflow-hidden bg-[#eef2f5]">
            {/* MAP LAYER */}
            <div className="absolute inset-0 z-0">
                <MapContainer
                    center={START_POS}
                    zoom={14}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                    attributionControl={false}
                >
                    {/* Light styled tile layer from CartoDB which looks like Google Maps light */}
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />

                    <MapUpdater startUrl={START_POS} endUrl={END_POS} currentPos={currentPos} />

                    {/* Background thick driving path line */}
                    <Polyline
                        positions={routePoints}
                        pathOptions={{ color: '#475569', weight: 14, lineCap: 'round', lineJoin: 'round' }}
                    />
                    {/* Dash line center style */}
                    <Polyline
                        positions={routePoints}
                        pathOptions={{ color: '#ffffff', weight: 2, dashArray: '10, 15' }}
                    />

                    {/* Progress Path (Blue overlay) - Draw from start to current */}
                    <Polyline
                        positions={routePoints.slice(0, currentIndex + 1)}
                        pathOptions={{ color: '#3b82f6', weight: 14, lineCap: 'round', lineJoin: 'round' }}
                    />
                    {/* Inner highlight for progress */}
                    <Polyline
                        positions={routePoints.slice(0, currentIndex + 1)}
                        pathOptions={{ color: '#60a5fa', weight: 6, lineCap: 'round', lineJoin: 'round' }}
                    />

                    <Marker position={START_POS} icon={startMarkerIcon} />
                    <Marker position={END_POS} icon={endMarkerIcon} />
                    <Marker position={currentPos} icon={ambulanceMovingIcon} />
                </MapContainer>
            </div>

            {/* OVERLAY UI CARD - Matches Screenshot */}
            <div className="absolute top-6 right-6 z-10 bg-white rounded-xl shadow-2xl p-6 w-[280px] border border-slate-100 flex flex-col pointer-events-auto">

                {/* Header */}
                <div className="border-b border-slate-100 pb-4 mb-4">
                    <h2 className="text-[#1d4ed8] text-2xl font-bold tracking-tight">QwikAid</h2>
                </div>

                {/* Speed Stats */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <div className="flex flex-col">
                        <span className="text-[#475569] text-sm font-semibold mb-1">Speed</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-[#334155]">{speed}</span>
                            <span className="text-[#64748b] font-medium tracking-tight">km/h</span>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-slate-700 relative flex items-center justify-center">
                        {/* Simple Gauge icon mimicking screenshot */}
                        <div className="absolute bottom-1 w-full h-1/2 overflow-hidden flex justify-center items-end">
                            <div className="w-6 h-6 border-[3px] border-slate-700 border-b-0 rounded-t-full relative">
                                <div
                                    className="w-4 h-[2px] bg-[#ef4444] absolute bottom-0 left-1 origin-left rounded-full transition-transform duration-300"
                                    style={{ transform: `rotate(${Math.min(180, (speed / 120) * 180)}deg)` }}
                                />
                            </div>
                        </div>
                        <div className="absolute bottom-1 w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                        <div className="absolute bottom-[2px] w-4 h-[1px] bg-slate-400"></div>
                    </div>
                </div>

                {/* Distance Stats */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <div className="flex flex-col">
                        <span className="text-[#475569] text-sm font-semibold mb-1">Distance Left</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-[#334155]">{remainingDist.toFixed(1)}</span>
                            <span className="text-[#64748b] font-medium tracking-tight">km</span>
                        </div>
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center relative">
                        <MapPin className="w-8 h-8 text-[#475569] fill-[#94a3b8] absolute z-10" />
                        <div className="w-8 h-2 bg-slate-300 rounded-[100%] absolute -bottom-1"></div>
                    </div>
                </div>

                {/* ETA */}
                <div className="flex flex-col">
                    <span className="text-[#475569] text-sm font-semibold mb-1">ETA</span>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-bold text-[#334155]">{mins}</span>
                        <span className="text-[#64748b] font-medium">mins</span>
                        <span className="text-3xl font-bold text-[#334155]">{secs}</span>
                        <span className="text-[#64748b] font-medium">secs</span>
                    </div>
                </div>
            </div>

        </div>
    );
}
