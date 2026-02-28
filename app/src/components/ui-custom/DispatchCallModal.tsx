import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmergencyStore } from '@/stores';
import { PhoneOff, AudioLines } from 'lucide-react';

export default function DispatchCallModal() {
    const { dispatchCallStatus, setDispatchCallStatus, selectedHospital, assignedAmbulance, assignedDoctor } = useEmergencyStore();
    const [callDuration, setCallDuration] = useState(0);

    // Transition from dialing to connected after 2.5 seconds
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (dispatchCallStatus === 'dialing') {
            timeout = setTimeout(() => {
                setDispatchCallStatus('connected');
            }, 2500);
        }
        return () => clearTimeout(timeout);
    }, [dispatchCallStatus, setDispatchCallStatus]);

    // Handle Voice Synthesis on connection
    useEffect(() => {
        if (dispatchCallStatus === 'connected') {
            setCallDuration(0);
            const synth = window.speechSynthesis;
            synth.cancel(); // Cancel any ongoing speech

            // The script based on the exact prompt
            const script = `Hello Saurabh. This is QwikAid Emergency Dispatch. 
        Your ambulance has been successfully dispatched and is arriving in approximately ${assignedAmbulance?.eta ? `${assignedAmbulance.eta} minutes` : '4 minutes'}.
        ${selectedHospital?.name || 'Aakash Healthcare Super Speciality Hospital, Dwarka'} has confirmed your admission.
        ${assignedDoctor?.name || 'Dr. Sharma'} has been assigned and is preparing for your arrival.
        Please remain calm and stay at your current location.
        Help is on the way.`;

            let utterance = new SpeechSynthesisUtterance(script);

            // Find Indian English voice
            const setVoice = () => {
                const voices = synth.getVoices();
                const indianVoice = voices.find(v => v.lang === 'en-IN');
                const defaultVoice = voices.find(v => v.lang.startsWith('en'));
                if (indianVoice) utterance.voice = indianVoice;
                else if (defaultVoice) utterance.voice = defaultVoice;
            };

            setVoice(); // Try immediately
            if (synth.onvoiceschanged !== undefined) {
                synth.onvoiceschanged = setVoice;
            }

            utterance.rate = 0.9;
            utterance.pitch = 1.0;

            utterance.onend = () => {
                setDispatchCallStatus('ended');
            };

            utterance.onerror = () => {
                setDispatchCallStatus('ended'); // fallback to close
            };

            // Start speaking after a tiny delay
            setTimeout(() => {
                synth.speak(utterance);
            }, 500);

            // Cleanup
            return () => {
                synth.cancel();
            };
        }
    }, [dispatchCallStatus, assignedAmbulance?.eta, selectedHospital?.name, assignedDoctor?.name, setDispatchCallStatus]);

    // Handle call timer
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (dispatchCallStatus === 'connected') {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [dispatchCallStatus]);

    // Clean up and reset completely when closed
    const handleEndCall = () => {
        window.speechSynthesis.cancel();
        setDispatchCallStatus('ended');
        setTimeout(() => setDispatchCallStatus('idle'), 3000); // Wait for fade out
    };

    // Close entirely after 3s of ended state
    useEffect(() => {
        if (dispatchCallStatus === 'ended') {
            const timeout = setTimeout(() => {
                setDispatchCallStatus('idle');
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [dispatchCallStatus, setDispatchCallStatus]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (dispatchCallStatus === 'idle') return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/80 backdrop-blur-2xl"
            >
                <div className="w-full max-w-sm h-full max-h-[850px] relative flex flex-col justify-between items-center py-20 overflow-hidden">

                    {/* Top Section: Caller Info */}
                    <div className="flex flex-col items-center mt-10">
                        <h2 className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-2 select-none">
                            QwikAid Emergency
                        </h2>
                        <h1 className="text-4xl font-semibold text-white tracking-tight mb-2 text-center px-4">
                            Dispatch Center
                        </h1>

                        <p className="text-white/80 font-mono text-lg transition-all duration-300 min-h-[30px] flex items-center justify-center">
                            {dispatchCallStatus === 'dialing' && "Dialing..."}
                            {dispatchCallStatus === 'connected' && formatTime(callDuration)}
                            {dispatchCallStatus === 'ended' && "Call Ended"}
                        </p>
                    </div>

                    {/* Middle Section: Avatar / Graphics */}
                    <div className="relative flex items-center justify-center w-full h-[300px]">
                        {/* The Avatar */}
                        <motion.div
                            className="relative z-20 w-36 h-36 rounded-full bg-slate-800 border-4 border-slate-700 shadow-2xl flex items-center justify-center overflow-hidden"
                            animate={dispatchCallStatus === 'connected' ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        >
                            <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay"></div>
                            <AudioLines className="w-16 h-16 text-blue-400 opacity-90" />
                        </motion.div>

                        {/* Ripple Effects for Dialing */}
                        {dispatchCallStatus === 'dialing' && (
                            <>
                                <motion.div
                                    className="absolute z-10 w-36 h-36 rounded-full border-2 border-slate-600 opacity-50"
                                    animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                                />
                                <motion.div
                                    className="absolute z-10 w-36 h-36 rounded-full border-2 border-slate-600 opacity-30"
                                    animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                />
                            </>
                        )}

                        {/* Simulated Live Audio Waveform Data */}
                        {dispatchCallStatus === 'connected' && (
                            <div className="absolute w-[200px] h-10 flex items-center justify-center gap-1.5 z-30 bottom-[-60px]">
                                {[...Array(12)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1.5 bg-blue-400 rounded-full"
                                        animate={{ height: [`${10 + Math.random() * 20}px`, `${20 + Math.random() * 30}px`, `${10 + Math.random() * 20}px`] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 0.3 + Math.random() * 0.2,
                                            ease: "easeInOut",
                                            delay: Math.random() * 0.2
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Connection Secure Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: dispatchCallStatus === 'connected' ? 1 : 0, y: dispatchCallStatus === 'connected' ? 0 : 10 }}
                            className="absolute z-30 bottom-[-100px] flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-full"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse border border-slate-900"></span>
                            <span className="text-xs text-green-400 font-bold uppercase tracking-wider">Secured Line</span>
                        </motion.div>
                    </div>

                    {/* Bottom Section: Call Controls */}
                    <div className="flex items-center justify-center w-full mb-10 pb-[env(safe-area-inset-bottom)]">
                        <motion.button
                            onClick={handleEndCall}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-20 h-20 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all"
                        >
                            <PhoneOff className="w-8 h-8 text-white fill-white" />
                        </motion.button>
                    </div>

                </div>
            </motion.div>
        </AnimatePresence>
    );
}
