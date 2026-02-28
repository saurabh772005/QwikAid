import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatIconProps {
    onClick: () => void;
    isOpen: boolean;
}

export function ChatIcon({ onClick, isOpen }: ChatIconProps) {
    return (
        <motion.button
            onClick={onClick}
            className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all z-50 ${isOpen ? 'bg-slate-700 text-gray-400 rotate-90 scale-90' : 'bg-blue-600 text-white'
                }`}
            whileHover={{ scale: 1.1 }}
            animate={isOpen ? {} : {
                boxShadow: ["0px 0px 0px 0px rgba(37,99,235,0.4)", "0px 0px 0px 15px rgba(37,99,235,0)"]
            }}
            transition={isOpen ? {} : { duration: 1.5, repeat: Infinity }}
        >
            <MessageCircle className="w-6 h-6" />
        </motion.button>
    );
}
