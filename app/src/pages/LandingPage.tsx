import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '@/assets/qwikaid-logo.png';
import { useState } from 'react';
import {
  HeroSection,
  TrustMetricsSection,
  ProblemSection,
  WorkflowSection,
  PlatformPreviewSection,
  FinalCTASection,
} from '@/components/landing';

// Navigation Component
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#workflow' },
    { label: 'Platform', href: '#platform' },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="QwikAid Logo" className="h-14 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/login"
              className="text-gray-400 hover:text-white font-medium transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-slate-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
                <Link
                  to="/login"
                  className="text-center py-3 text-gray-400 hover:text-white font-medium border border-slate-800 rounded-xl transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-center shadow-lg shadow-blue-500/20"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <img src={logo} alt="QwikAid Logo" className="h-20 w-auto object-contain" />
            </Link>
            <p className="text-gray-400 text-sm max-w-sm">
              AI-powered emergency response platform connecting patients, hospitals,
              and ambulances in real-time. Saving lives through intelligent coordination.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard/emergency" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Emergency
                </Link>
              </li>
              <li>
                <Link to="/dashboard/guidance" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Healthcare Guidance
                </Link>
              </li>
              <li>
                <Link to="/dashboard/yojna" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Sarkari Yojna
                </Link>
              </li>
              <li>
                <Link to="/dashboard/insurance" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Insurance
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm">
                <span className="text-blue-400 font-medium">support@qwikaid.com</span>
              </li>
              <li className="text-gray-400 text-sm">
                Available 24/7 across India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} QwikAid. All rights reserved.
            Made with care for a healthier India.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Main Landing Page
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />

      <main className="pt-16">
        <HeroSection />
        <TrustMetricsSection />
        <section id="features">
          <ProblemSection />
        </section>
        <section id="workflow">
          <WorkflowSection />
        </section>
        <section id="platform">
          <PlatformPreviewSection />
        </section>
        <FinalCTASection />
      </main>

      <Footer />
    </div>
  );
}
