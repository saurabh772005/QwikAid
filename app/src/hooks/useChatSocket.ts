import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    severity?: 'minor' | 'critical';
}

export const useChatSocket = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [criticalTriggered, setCriticalTriggered] = useState(false);

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        socket.on('chat_reply', (data: { reply: string, severity_level: string }) => {
            setIsTyping(false);
            const newMessage: ChatMessage = {
                id: Math.random().toString(36).substring(7),
                text: data.reply,
                sender: 'bot',
                timestamp: new Date(),
                severity: data.severity_level as 'minor' | 'critical'
            };

            setMessages(prev => [...prev, newMessage]);

            if (data.severity_level === 'critical') {
                setCriticalTriggered(true);
            }
        });

        return () => {
            socket.off('chat_reply');
        };
    }, []);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;

        const userMsg: ChatMessage = {
            id: Math.random().toString(36).substring(7),
            text,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        socket.emit('chat_message', {
            message: text,
            user_id: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id : 'anonymous'
        });
    };

    return {
        messages,
        isTyping,
        criticalTriggered,
        sendMessage,
        setCriticalTriggered
    };
};
