import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertCircle,
    MapPin,
    Activity,
    CheckCircle,
    Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { socket } from '@/lib/socket';

interface EmergencyCase {
    case_id: string;
    status: string;
    severity_level: string;
    emergency_type: string;
    location_data?: string;
    lat: number;
    lng: number;
    required_specialist: string;
    symptoms?: string;
    timeline?: any[];
}

export default function DoctorPortal() {
    const [requests, setRequests] = useState<EmergencyCase[]>([]);
    const [timers, setTimers] = useState<Record<string, number>>({});
    const [acceptedCase, setAcceptedCase] = useState<string | null>(null);

    const fetchRequests = async () => {
        const token = localStorage.getItem('token');
        const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
        try {
            const response = await fetch(`${baseUrl}/api/doctor-requests`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to fetch requests');

            // Initialize 30 sec timers for new Requests
            const newTimers = { ...timers };
            data.forEach((req: EmergencyCase) => {
                // Initialize timers for any unresolved case
                if (['Initiated', 'Triaged', 'Hospital Selected', 'Assigning Doctor'].includes(req.status) && !newTimers[req.case_id]) {
                    newTimers[req.case_id] = 30;
                }
            });
            setTimers(newTimers);
            setRequests(data);
        } catch (error) {
            console.error('Failed to fetch requests:', error);
            toast.error('Failed to load emergency requests');
        }
    };

    const fetchHistory = async () => {
        // Disabled history fetch for now as it's not in the new layout
    };

    useEffect(() => {
        fetchRequests();
        fetchHistory();

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit('join_doctor_room', {});

        socket.on('new_case_notification', (data) => {
            console.log('New case notification:', data);
            toast.info(`New Emergency Case: #${data.case_id}`);
            fetchRequests(); // Refresh the list
        });

        socket.on('doctor_timeout', () => {
            fetchRequests();
            fetchHistory();
        });

        return () => {
            socket.off('new_case_notification');
            socket.off('doctor_timeout');
        };
    }, []);

    // Countdown Timer Logic
    useEffect(() => {
        const interval = setInterval(() => {
            setTimers(prev => {
                const updated = { ...prev };
                let changed = false;
                Object.keys(updated).forEach(id => {
                    if (updated[id] > 0) {
                        updated[id] -= 1;
                        changed = true;

                        if (updated[id] === 0) {
                            // Auto reject on 0
                            handleReject(id, true);
                        }
                    }
                });
                return changed ? updated : prev;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleAccept = async (caseId: string) => {
        const token = localStorage.getItem('token');
        const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
        try {
            const response = await fetch(`${baseUrl}/api/doctor/accept/${caseId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    doctor: {
                        name: 'Dr. Priya Sharma',
                        specialty: 'Emergency Medicine',
                        experience: 12,
                        rating: 4.9,
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
                    }
                })
            });

            if (response.ok) {
                toast.success('Case accepted successfully!');
                setAcceptedCase(caseId);
                setTimeout(() => {
                    setAcceptedCase(null);
                    fetchRequests();
                }, 4000); // Show success banner for 4 seconds then refresh list
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to accept case');
            }
        } catch (error) {
            toast.error('Failed to accept case');
        }
    };

    const handleReject = async (caseId: string, isTimeout = false) => {
        const token = localStorage.getItem('token');
        const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
        try {
            const response = await fetch(`${baseUrl}/api/doctor/reject/${caseId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reason: isTimeout ? 'Timeout Reached' : 'Busy with another patient' })
            });

            if (response.ok) {
                toast.warning(isTimeout ? `Case #${caseId} escalated (Timeout)` : 'Case rejected');
                fetchRequests();
                fetchHistory();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to reject case');
            }
        } catch (error) {
            toast.error('Failed to reject case');
        }
    };

    const activeCase = requests[0];
    const queue = requests.slice(1);

    return (
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Emergency Escalation Center</h1>
                    {activeCase ? (
                        <p className="text-gray-400">Critical decision required for Case #{activeCase.case_id.split('-')[0]}</p>
                    ) : (
                        <p className="text-gray-400">Monitoring real-time emergency feeds...</p>
                    )}
                </div>
                {activeCase && (
                    <div className="px-4 py-1.5 border border-red-500/30 text-red-500 rounded-full text-xs font-bold uppercase tracking-widest bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        High Priority
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area - Active Case */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {!activeCase ? (
                            <motion.div
                                key="empty"
                                className="p-16 text-center bg-slate-900 border border-slate-800 rounded-3xl"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="w-20 h-20 mx-auto mb-6 bg-blue-500/10 rounded-full flex items-center justify-center">
                                    <Activity className="w-10 h-10 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No Active Escalations</h3>
                                <p className="text-gray-500 max-w-sm mx-auto">You have no pending emergency requests. The system will alert you when a trauma case is routed.</p>
                            </motion.div>
                        ) : acceptedCase === activeCase.case_id ? (
                            <motion.div
                                key="assigned"
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="bg-green-500/10 border border-green-500/30 rounded-3xl p-12 text-center"
                            >
                                <motion.div
                                    className="w-24 h-24 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1, rotate: 360 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                >
                                    <CheckCircle className="w-12 h-12 text-white" />
                                </motion.div>
                                <h3 className="text-3xl font-black text-white mb-3">Case has been assigned to you</h3>
                                <p className="text-green-400 text-lg">Your team is now designated as the primary emergency responders.</p>
                                <div className="mt-8">
                                    <Activity className="w-8 h-8 text-green-500 mx-auto animate-pulse" />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={activeCase.case_id}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                className="space-y-6"
                            >
                                {/* Countdown Timer Banner */}
                                <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-8 relative overflow-hidden shadow-[0_4px_30px_rgba(239,68,68,0.1)]">
                                    <div className="absolute top-0 left-0 h-1 bg-red-500 w-full" />
                                    <div className="flex justify-between items-center relative z-10">
                                        <div>
                                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Time to Auto-Reassign</p>
                                            <div className={`font-mono text-6xl font-black ${timers[activeCase.case_id] <= 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                                00:{timers[activeCase.case_id] < 10 ? `0${timers[activeCase.case_id] || 0}` : timers[activeCase.case_id] || '30'}
                                            </div>
                                        </div>
                                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                                            <Clock className="w-8 h-8 text-red-500" />
                                        </div>
                                    </div>
                                </div>

                                {/* Patient Vitals Grid */}
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-white font-bold text-lg">Patient Vitals: Unknown Adult</h3>
                                        <button className="text-blue-400 text-xs font-bold uppercase tracking-wider hover:text-blue-300">View Full History</button>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                                            <p className="text-gray-500 text-xs font-bold mb-1">BPM</p>
                                            <div className="text-3xl font-black text-red-500 mb-2">142</div>
                                            <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-red-500 w-[80%]" /></div>
                                        </div>
                                        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                                            <p className="text-gray-500 text-xs font-bold mb-1">BP</p>
                                            <div className="text-3xl font-black text-white mb-1">180<span className="text-xl text-gray-500">/110</span></div>
                                            <p className="text-orange-400 text-xs font-medium">Stage 2 Hypertensive</p>
                                        </div>
                                        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                                            <p className="text-gray-500 text-xs font-bold mb-1">SPO2</p>
                                            <div className="text-3xl font-black text-yellow-500 mb-1">91%</div>
                                            <p className="text-gray-400 text-xs">Falling (Trend)</p>
                                        </div>
                                        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                                            <p className="text-gray-500 text-xs font-bold mb-1">TEMP</p>
                                            <div className="text-3xl font-black text-white mb-1">37.2°C</div>
                                            <p className="text-gray-400 text-xs">Stable</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertCircle className="w-4 h-4 text-orange-400" />
                                            <h4 className="text-orange-400 font-bold text-sm">Field Assessment Note</h4>
                                        </div>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            "{activeCase.symptoms || "Patient unresponsive to initial stimulus. Suspected cardiac event. Requesting immediate bypass to Trauma-1."}"
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-6">
                                    <button
                                        onClick={() => handleReject(activeCase.case_id)}
                                        className="py-5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all border border-slate-700 flex items-center justify-center gap-2 text-lg"
                                    >
                                        <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                                            <span className="block w-3 h-0.5 bg-current rotate-45 transform translate-y-[2px]" />
                                            <span className="block w-3 h-0.5 bg-current -rotate-45 transform -translate-y-[2px] -translate-x-3" />
                                        </div>
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleAccept(activeCase.case_id)}
                                        className="py-5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-lg shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                                    >
                                        <CheckCircle className="w-6 h-6" />
                                        Accept Case
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Incoming Queue Sidebar */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Incoming Queue</h3>
                        <div className="space-y-3">
                            {queue.length === 0 ? (
                                <div className="p-6 text-center border-2 border-dashed border-slate-800 rounded-xl text-gray-600 text-sm">
                                    End of prioritized queue
                                </div>
                            ) : (
                                queue.map(req => (
                                    <div key={req.case_id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase rounded">Urgent</span>
                                                <span className="text-gray-500 text-xs">Waiting</span>
                                            </div>
                                            <h4 className="text-white font-bold">Case #{req.case_id.split('-')[0]}</h4>
                                            <p className="text-gray-400 text-xs">{req.emergency_type} • 2 min ago</p>
                                        </div>
                                        {timers[req.case_id] && (
                                            <div className="text-right">
                                                <div className="text-xl font-bold font-mono text-orange-400">{timers[req.case_id]}s</div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {activeCase && (
                        <div className="h-48 bg-slate-800 rounded-2xl border border-slate-700 relative overflow-hidden p-4 bg-[url('https://api.maptiler.com/maps/basic-v2-dark/static/-122.4194,37.7749,12/400x300.png?key=get_your_own_OpIi9ZULNHzrESv6T2vL')] bg-cover bg-center">
                            <div className="absolute inset-0 bg-slate-900/60" />
                            <div className="relative z-10">
                                <div className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-2 shadow-lg mb-2">
                                    <MapPin className="w-3 h-3 text-red-500" /> Ambulance Location
                                </div>
                            </div>
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-blue-500 rounded-full border-4 border-slate-900 shadow-xl flex items-center justify-center">
                                <Activity className="w-5 h-5 text-white animate-pulse" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
