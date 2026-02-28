import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Activity,
  FileText,
  Shield,
  User,
  LogOut,
  Menu,
  Bell,
  ChevronDown,
  Stethoscope,
} from 'lucide-react';
import { useAuthStore, useEmergencyStore } from '@/stores';
import { useLocation } from '@/hooks/useLocation';
import logo from '@/assets/qwikaid-logo.png';
import { ChatIcon } from '@/components/chatbot/ChatIcon';
import { ChatWindow } from '@/components/chatbot/ChatWindow';
import { MapPin } from 'lucide-react';

// Sidebar Component
function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAuthStore();

  // Conditionally build Navigation Items based on Role
  const navItems = user?.role === 'doctor'
    ? [
      { path: '/dashboard/doctor', label: 'Doctor Portal', icon: Stethoscope },
      { path: '/dashboard/profile', label: 'Profile', icon: User },
    ]
    : [
      { path: '/dashboard/emergency', label: 'Emergency', icon: AlertCircle },
      { path: '/dashboard/guidance', label: 'Healthcare Guidance', icon: Activity },
      { path: '/dashboard/yojna', label: 'Sarkari Yojna', icon: FileText },
      { path: '/dashboard/insurance', label: 'Health Insurance', icon: Shield },
      { path: '/dashboard/profile', label: 'Profile', icon: User },
    ];
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } transition-transform duration-300 ease-in-out`}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <NavLink to="/" className="flex items-center">
            <img src={logo} alt="QwikAid Logo" className="h-11 w-auto object-contain" />
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.path === '/dashboard/emergency' && (
                  <span className="ml-auto px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                    24/7
                  </span>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

      </motion.aside>
    </>
  );
}

// Top Navbar Component
function TopNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuthStore();
  const { userLocation, currentStage } = useEmergencyStore();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.header
      className="h-16 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 flex items-center justify-between px-4 lg:px-6"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Breadcrumb */}
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-white">Overview</span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Location Badge */}
        {user?.role === 'user' && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-full">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-gray-300">
              {userLocation
                ? (userLocation as any).areaName || `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
                : 'Locating...'}
            </span>
          </div>
        )}

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          {currentStage === 6 && (
            <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-slate-900" />
          )}
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
              alt={user?.name}
              className="w-8 h-8 rounded-full bg-slate-700"
            />
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-white">{user?.name}</div>
              <div className="text-xs text-gray-400 capitalize">{user?.role}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <NavLink
                  to="/dashboard/profile"
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}

// Main Dashboard Layout
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { user } = useAuthStore();
  useLocation();

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Global Real-time Chatbot Overlay (Only for regular users) */}
      {user?.role === 'user' && (
        <>
          <ChatIcon isOpen={chatOpen} onClick={() => setChatOpen(!chatOpen)} />
          <ChatWindow isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </>
      )}
    </div>
  );
}
