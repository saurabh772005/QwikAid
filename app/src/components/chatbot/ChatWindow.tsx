import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, AlertTriangle, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChatSocket } from '@/hooks/useChatSocket';

interface ChatWindowProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
    const { messages, isTyping, criticalTriggered, sendMessage, setCriticalTriggered } = useChatSocket();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isTyping, isOpen]);

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input.trim());
            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const triggerEmergency = () => {
        onClose();
        setCriticalTriggered(false);
        navigate('/dashboard/emergency');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[550px] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50"
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                >
                    {/* Header */}
                    <div className="bg-slate-800 p-4 flex items-center justify-between border-b border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center relative">
                                <Stethoscope className="w-5 h-5 text-blue-400" />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">QwikAid Assistant</h3>
                                <p className="text-xs text-green-400">Online • AI Agent</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-400 text-sm mt-10">
                                <Stethoscope className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                                <p>Hello! I am your AI health assistant.</p>
                                <p className="mt-1">How can I help you today?</p>
                            </div>
                        )}

                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-sm'
                                            : msg.severity === 'critical'
                                                ? 'bg-red-500/20 border border-red-500/50 text-red-200 rounded-bl-sm'
                                                : 'bg-slate-800 text-gray-200 border border-slate-700 rounded-bl-sm'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                </div>
                                <span className="text-[10px] text-gray-500 mt-1">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </motion.div>
                        ))}

                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-start"
                            >
                                <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-bl-sm flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <motion.div className="w-1.5 h-1.5 bg-blue-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                                        <motion.div className="w-1.5 h-1.5 bg-blue-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                                        <motion.div className="w-1.5 h-1.5 bg-blue-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                                    </div>
                                    <span className="text-xs text-blue-400 ml-2">Analyzing...</span>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Critical CTA Banner */}
                    <AnimatePresence>
                        {criticalTriggered && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-red-500/10 border-t border-red-500/20 p-3"
                            >
                                <button
                                    onClick={triggerEmergency}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-red-500/20"
                                >
                                    <AlertTriangle className="w-4 h-4" />
                                    TRIGGER EMERGENCY PROTOCOL
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Input Area */}
                    <div className="bg-slate-800 p-3 border-t border-slate-700">
                        <div className="relative flex items-center">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your symptoms..."
                                className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-blue-500 resize-none h-12 shadow-inner"
                                rows={1}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-500 text-center mt-2">
                            For minor health queries only. Do not rely on AI for critical medical advice.
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
