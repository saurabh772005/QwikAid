import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Mic, Settings2 } from 'lucide-react';
import { useEmergencyStore } from '@/stores';

export default function IncomingCallModal() {
    const { callStatus, setCallStatus, assignedAmbulance, selectedHospital, assignedDoctor } = useEmergencyStore();
    const [callDuration, setCallDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Trigger auto-answer after 3 seconds of ringing
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (callStatus === 'ringing') {
            timeout = setTimeout(() => {
                handleAnswer();
            }, 3000);
        }
        return () => clearTimeout(timeout);
    }, [callStatus]);

    // Handle ringing sound
    useEffect(() => {
        if (callStatus === 'ringing') {
            audioRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/phone_ringing.ogg');
            audioRef.current.loop = true;
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        } else if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, [callStatus]);

    // Handle call timer
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (callStatus === 'connected') {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [callStatus]);

    // Handle Speech Synthesis when connected
    useEffect(() => {
        if (callStatus === 'connected') {
            speakMessage();
        }
    }, [callStatus]);

    const speakMessage = () => {
        if (!('speechSynthesis' in window)) {
            setTimeout(() => endCall(), 5000);
            return;
        }

        const synth = window.speechSynthesis;
        // Cancel any ongoing speech
        synth.cancel();

        // The script based on the exact prompt
        const script = `Hello Saurabh. This is QwikAid emergency confirmation system. 
    Your ambulance has been successfully dispatched. 
    Nearest hospital ${selectedHospital?.name || 'Aakash Healthcare Super Speciality Hospital, Dwarka'} has reserved an ICU bed. 
    Dr. ${assignedDoctor?.name ? assignedDoctor.name.replace('Dr. ', '') : 'Sarah Chen'} has accepted your case. 
    Estimated arrival time is ${assignedAmbulance?.eta || '4 minutes and 42 seconds'}. 
    Please stay calm. Help is on the way.`;

        const utterance = new SpeechSynthesisUtterance(script);

        // Configure voice properties
        utterance.rate = 0.9;
        utterance.pitch = 1;

        // Try to find an Indian English voice
        const setVoice = () => {
            const voices = synth.getVoices();
            const indianVoice = voices.find(v => v.lang.includes('en-IN') && v.name.includes('Female')) ||
                voices.find(v => v.lang.includes('en-IN')) ||
                voices.find(v => v.lang.includes('en-GB')) ||
                voices[0];

            if (indianVoice) {
                utterance.voice = indianVoice;
            }
            synth.speak(utterance);
        };

        if (synth.getVoices().length === 0) {
            synth.onvoiceschanged = setVoice;
        } else {
            setVoice();
        }

        utterance.onend = () => {
            setTimeout(() => {
                const closingUtterance = new SpeechSynthesisUtterance("If you need further assistance, press the emergency button inside the app. Thank you for trusting QwikAid.");
                closingUtterance.rate = 0.9;

                const voices = synth.getVoices();
                const indianVoice = voices.find(v => v.lang.includes('en-IN') && v.name.includes('Female')) || voices.find(v => v.lang.includes('en-IN')) || voices[0];
                if (indianVoice) closingUtterance.voice = indianVoice;

                synth.speak(closingUtterance);

                closingUtterance.onend = () => {
                    endCall();
                };
            }, 2000);
        };
    };

    const handleAnswer = () => {
        if (callStatus === 'ringing') {
            setCallStatus('connected');
        }
    };

    const endCall = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        setCallStatus('ended');
        setTimeout(() => {
            setCallStatus('idle');
        }, 2500); // Wait 2.5s on the "ended" screen before unmounting
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (callStatus === 'idle') return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-sm bg-slate-900 border border-slate-700/50 rounded-[2.5rem] shadow-2xl overflow-hidden relative"
                >
                    {/* Pulsing background effect for ringing */}
                    {callStatus === 'ringing' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <motion.div
                                animate={{ scale: [1, 1.5, 2], opacity: [0.3, 0.1, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                                className="w-48 h-48 bg-blue-500 rounded-full"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.3, 1.8], opacity: [0.4, 0.2, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                                className="absolute w-48 h-48 bg-blue-500 rounded-full"
                            />
                        </div>
                    )}

                    {/* Top Info */}
                    <div className="pt-12 pb-6 px-6 text-center relative z-10">
                        <h2 className="text-gray-400 text-sm tracking-widest uppercase font-semibold mb-2">
                            {callStatus === 'ringing' ? 'Incoming Call' : callStatus === 'connected' ? 'Live Call' : 'Call Ended'}
                        </h2>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">QwikAid Emergency AI</h1>
                        <p className="text-xl text-blue-400 font-medium font-mono tracking-wider">+91-108-EMERGENCY</p>
                    </div>

                    {/* Center Visualizer */}
                    <div className="flex items-center justify-center h-40 relative z-10">
                        {callStatus === 'ringing' ? (
                            <motion.div
                                animate={{ rotate: [-2, 2, -2] }}
                                transition={{ duration: 0.1, repeat: Infinity }}
                                className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30"
                            >
                                <Phone className="w-10 h-10 text-blue-400 drop-shadow-lg" />
                            </motion.div>
                        ) : callStatus === 'connected' ? (
                            <div className="flex flex-col items-center gap-6">
                                {/* Animated waveform bars */}
                                <div className="flex items-end justify-center gap-1.5 h-16">
                                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: ['20%', '100%', '20%'] }}
                                            transition={{
                                                duration: 0.5 + Math.random() * 0.5,
                                                repeat: Infinity,
                                                delay: i * 0.1,
                                                ease: 'easeInOut'
                                            }}
                                            className="w-2 bg-blue-400 rounded-full"
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="text-blue-400 font-mono text-xl">{formatTime(callDuration)}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-slate-500 text-lg">Duration: {formatTime(callDuration)}</div>
                        )}
                    </div>

                    {/* Bottom Controls */}
                    <div className="p-8 pt-4 pb-12 relative z-10">
                        {callStatus === 'ringing' ? (
                            <div className="flex justify-around items-center">
                                <div className="flex flex-col items-center gap-3">
                                    <motion.button
                                        onClick={endCall}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20"
                                    >
                                        <PhoneOff className="w-7 h-7 text-white" />
                                    </motion.button>
                                    <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Reject</span>
                                </div>

                                <div className="flex flex-col items-center gap-3">
                                    <motion.button
                                        onClick={handleAnswer}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20"
                                    >
                                        <Phone className="w-7 h-7 text-white fill-current" />
                                    </motion.button>
                                    <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Accept</span>
                                </div>
                            </div>
                        ) : callStatus === 'connected' ? (
                            <div className="flex justify-center flex-col items-center gap-6">
                                <div className="flex gap-6 justify-center w-full">
                                    <button className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition">
                                        <Mic className="w-5 h-5" />
                                    </button>
                                    <button className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition">
                                        <Settings2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <motion.button
                                    onClick={endCall}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20"
                                >
                                    <PhoneOff className="w-7 h-7 text-white" />
                                </motion.button>
                            </div>
                        ) : null}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
