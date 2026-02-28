import { motion } from 'framer-motion';
import { AlertTriangle, Clock, MapPin, Phone, XCircle } from 'lucide-react';

const painPoints = [
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Delayed Response Times',
    description: 'Average ambulance arrival time in India is 15-20 minutes, critical for emergency situations.',
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: 'No Real-time Tracking',
    description: 'Patients and families have no visibility into ambulance location or ETA.',
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: 'Fragmented Communication',
    description: 'Multiple calls needed between patient, ambulance, and hospital with no coordination.',
  },
  {
    icon: <XCircle className="w-6 h-6" />,
    title: 'Bed Availability Unknown',
    description: 'Patients often arrive at hospitals with no available emergency beds.',
  },
];

export function ProblemSection() {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative rounded-2xl overflow-hidden">
              {/* City Background with Ambulance */}
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl relative overflow-hidden">
                {/* City Silhouette */}
                <svg
                  viewBox="0 0 400 300"
                  className="absolute bottom-0 left-0 right-0 w-full"
                  preserveAspectRatio="xMidYMax slice"
                >
                  {/* Buildings */}
                  <rect x="20" y="150" width="40" height="150" fill="#1e293b" />
                  <rect x="70" y="100" width="50" height="200" fill="#0f172a" />
                  <rect x="130" y="180" width="35" height="120" fill="#1e293b" />
                  <rect x="180" y="80" width="60" height="220" fill="#0f172a" />
                  <rect x="250" y="140" width="45" height="160" fill="#1e293b" />
                  <rect x="310" y="170" width="50" height="130" fill="#0f172a" />
                  
                  {/* Windows */}
                  {Array.from({ length: 30 }).map((_, i) => (
                    <rect
                      key={i}
                      x={25 + (i % 6) * 60 + Math.random() * 20}
                      y={110 + Math.floor(i / 6) * 40 + Math.random() * 20}
                      width="8"
                      height="12"
                      fill="#fbbf24"
                      opacity={Math.random() > 0.5 ? 0.6 : 0.2}
                    />
                  ))}
                </svg>

                {/* Stuck Ambulance Animation */}
                <motion.div
                  className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                  animate={{
                    x: [-5, 5, -5],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <div className="relative">
                    {/* Ambulance */}
                    <div className="w-24 h-12 bg-white rounded-lg relative">
                      <div className="absolute top-2 left-2 w-8 h-6 bg-slate-700 rounded" />
                      <div className="absolute top-2 right-8 w-6 h-6 bg-slate-700 rounded" />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-3 h-6 bg-red-500 rounded-sm" />
                        <div className="w-6 h-3 bg-red-500 rounded-sm absolute top-1.5 -left-1.5" />
                      </div>
                    </div>
                    {/* Wheels */}
                    <div className="absolute -bottom-3 left-3 w-5 h-5 bg-slate-800 rounded-full" />
                    <div className="absolute -bottom-3 right-6 w-5 h-5 bg-slate-800 rounded-full" />
                    
                    {/* Siren */}
                    <motion.div
                      className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-blue-500 rounded-t"
                      animate={{
                        backgroundColor: ['#3b82f6', '#ef4444', '#3b82f6'],
                      }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  </div>
                </motion.div>

                {/* Traffic Lines */}
                <motion.div
                  className="absolute bottom-4 left-0 right-0 h-1 bg-yellow-500/30"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              </div>

              {/* Warning Badge */}
              <motion.div
                className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-red-500/90 text-white rounded-lg"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-medium">Critical Delay</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Pain Points */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 text-sm font-medium mb-4">
                The Problem
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Emergency Response is Broken
              </h2>
              <p className="text-gray-400 mb-8">
                Every minute counts in an emergency, yet our current system fails to deliver 
                timely, coordinated care when it matters most.
              </p>
            </motion.div>

            <div className="space-y-4">
              {painPoints.map((point, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-red-500/30 transition-colors"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0"
                    whileHover={{ rotate: 5, scale: 1.05 }}
                  >
                    <div className="text-red-400">{point.icon}</div>
                  </motion.div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{point.title}</h3>
                    <p className="text-gray-400 text-sm">{point.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
