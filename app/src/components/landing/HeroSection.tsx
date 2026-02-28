import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Animated Ambulance SVG Component
const AnimatedAmbulance = () => {
  return (
    <motion.svg
      width="200"
      height="100"
      viewBox="0 0 200 100"
      className="absolute bottom-20 left-0"
      initial={{ x: '-100%' }}
      animate={{ x: 'calc(100vw + 200px)' }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {/* Ambulance Body */}
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Main Body */}
        <rect x="20" y="30" width="140" height="50" rx="8" fill="#ffffff" />
        <rect x="20" y="30" width="140" height="50" rx="8" fill="url(#ambulanceGradient)" opacity="0.9" />

        {/* Cab */}
        <path d="M160 30 L180 30 L190 50 L190 80 L160 80 Z" fill="#ffffff" />
        <path d="M160 30 L180 30 L190 50 L190 80 L160 80 Z" fill="url(#cabGradient)" opacity="0.9" />

        {/* Windows */}
        <rect x="30" y="38" width="40" height="20" rx="3" fill="#1e3a5f" opacity="0.8" />
        <rect x="80" y="38" width="40" height="20" rx="3" fill="#1e3a5f" opacity="0.8" />
        <path d="M165 38 L180 38 L185 50 L165 50 Z" fill="#1e3a5f" opacity="0.8" />

        {/* Red Cross */}
        <rect x="95" y="45" width="10" height="20" rx="2" fill="#ef4444" />
        <rect x="90" y="50" width="20" height="10" rx="2" fill="#ef4444" />

        {/* Wheels */}
        <circle cx="50" cy="85" r="12" fill="#1f2937" />
        <circle cx="50" cy="85" r="6" fill="#6b7280" />
        <circle cx="160" cy="85" r="12" fill="#1f2937" />
        <circle cx="160" cy="85" r="6" fill="#6b7280" />

        {/* Headlights */}
        <circle cx="188" cy="65" r="5" fill="#fbbf24" />
        <motion.circle
          cx="188"
          cy="65"
          r="8"
          fill="url(#headlightGlow)"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Siren Lights */}
        <motion.rect
          x="85"
          y="22"
          width="12"
          height="8"
          rx="2"
          fill="#3b82f6"
          animate={{
            fill: ['#3b82f6', '#ef4444', '#3b82f6'],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        <motion.rect
          x="103"
          y="22"
          width="12"
          height="8"
          rx="2"
          fill="#ef4444"
          animate={{
            fill: ['#ef4444', '#3b82f6', '#ef4444'],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />

        {/* Siren Glow */}
        <motion.ellipse
          cx="100"
          cy="26"
          rx="30"
          ry="15"
          fill="url(#sirenGlow)"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      </motion.g>

      {/* Definitions */}
      <defs>
        <linearGradient id="ambulanceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e5e7eb" />
        </linearGradient>
        <linearGradient id="cabGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d1d5db" />
        </linearGradient>
        <radialGradient id="headlightGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sirenGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
};

// ECG Waveform Component
const ECGWaveform = () => {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, repeat: Infinity, ease: 'linear' as const },
        opacity: { duration: 0.3 },
      },
    },
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
      <svg
        viewBox="0 0 1200 100"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="20%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="80%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <filter id="ecgGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.path
          d="M0,50 L100,50 L120,50 L140,20 L160,80 L180,10 L200,90 L220,50 L240,50 L260,50 
             L280,50 L300,50 L320,50 L340,20 L360,80 L380,10 L400,90 L420,50 L440,50 
             L460,50 L480,50 L500,50 L520,50 L540,20 L560,80 L580,10 L600,90 L620,50 
             L640,50 L660,50 L680,50 L700,50 L720,50 L740,20 L760,80 L780,10 L800,90 
             L820,50 L840,50 L860,50 L880,50 L900,50 L920,50 L940,20 L960,80 L980,10 
             L1000,90 L1020,50 L1040,50 L1060,50 L1080,50 L1100,50 L1120,50 L1140,20 
             L1160,80 L1180,10 L1200,90"
          fill="none"
          stroke="url(#ecgGradient)"
          strokeWidth="2"
          filter="url(#ecgGlow)"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
      </svg>
    </div>
  );
};

// Floating Particles Component
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-400"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// Main Hero Section
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  // Word animation for headline
  const headline = 'Reinventing Emergency Response with AI-Driven Coordination';
  const words = headline.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const accentWords = ['Emergency', 'AI-Driven'];

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ opacity, scale }}
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        {/* Dark Gradient Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800" />

        {/* Animated Light Pulses */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Floating Particles */}
        <FloatingParticles />
      </motion.div>

      {/* Ambulance Animation */}
      <AnimatedAmbulance />

      {/* ECG Waveform */}
      <ECGWaveform />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-sm text-blue-300">India&apos;s Smart Emergency Response Platform</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {words.map((word, index) => (
            <motion.span
              key={index}
              className={`inline-block mr-3 ${accentWords.includes(word.replace(/[^a-zA-Z-]/g, ''))
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400'
                  : ''
                }`}
              variants={wordVariants}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          AI-powered emergency coordination that connects patients, hospitals, and ambulances
          in real-time. Saving lives through intelligent healthcare logistics.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Link to="/signup">
            <motion.button
              className="group relative px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl overflow-hidden transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </Link>

          <Link to="/login">
            <motion.button
              className="group px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-sm border border-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center gap-2">
                Sign In
              </span>
            </motion.button>
          </Link>

          <Link to="/dashboard/emergency">
            <motion.button
              className="group relative px-8 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold rounded-xl border border-red-500/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Emergency Alert
              </span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="flex items-center justify-center gap-8 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {[
            { value: '24/7', label: 'Available' },
            { value: '< 3 min', label: 'Avg Response' },
            { value: '500+', label: 'Hospitals' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
    </motion.section>
  );
}
