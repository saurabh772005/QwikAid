import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Activity, 
  Phone, 
  Navigation,
  Heart,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

// 3D Tilt Card Component
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

function TiltCard({ children, className = '' }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  );
}

// Dashboard Mock Component
function DashboardMock() {
  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
      {/* Header */}
      <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-sm text-gray-400">QwikAid Dashboard</div>
        <div className="w-16" />
      </div>

      {/* Content */}
      <div className="p-4 grid grid-cols-3 gap-4">
        {/* Sidebar */}
        <div className="col-span-1 space-y-2">
          <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <div className="flex items-center gap-2 text-blue-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Emergency</span>
            </div>
          </div>
          <div className="p-3 bg-slate-800 rounded-lg">
            <div className="flex items-center gap-2 text-gray-400">
              <Activity className="w-4 h-4" />
              <span className="text-sm">Guidance</span>
            </div>
          </div>
          <div className="p-3 bg-slate-800 rounded-lg">
            <div className="flex items-center gap-2 text-gray-400">
              <Heart className="w-4 h-4" />
              <span className="text-sm">Yojna</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-2 space-y-3">
          {/* Status Card */}
          <div className="p-4 bg-slate-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-medium">Active Emergency</span>
              <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Critical</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>2 min ago</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>2.3 km away</span>
              </div>
            </div>
          </div>

          {/* Ambulance Card */}
          <div className="p-4 bg-slate-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Navigation className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">Ambulance Dispatched</div>
                <div className="text-sm text-gray-400">ETA: 4 minutes</div>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
            </div>
          </div>

          {/* Hospital Card */}
          <div className="p-4 bg-slate-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-white font-medium">Aakash Healthcare Super Speciality Hospital</div>
                <div className="text-sm text-green-400">Bed Reserved</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ 
  icon, 
  title, 
  description,
  delay 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <TiltCard className="h-full">
        <div className="h-full p-6 bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
            <div className="text-blue-400">{icon}</div>
          </div>
          <h3 className="text-white font-semibold mb-2">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </TiltCard>
    </motion.div>
  );
}

const features = [
  {
    icon: <MapPin className="w-6 h-6" />,
    title: 'Real-time Tracking',
    description: 'Track ambulance location and ETA with live GPS updates.',
  },
  {
    icon: <Activity className="w-6 h-6" />,
    title: 'AI Severity Assessment',
    description: 'Intelligent triage system prioritizes critical cases.',
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: 'Unified Communication',
    description: 'Connect all stakeholders in a single coordinated channel.',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Bed Management',
    description: 'Real-time bed availability across partner hospitals.',
  },
];

export function PlatformPreviewSection() {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-4">
            Platform Preview
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Powerful Dashboard at Your Fingertips
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our intuitive interface puts complete emergency control in your hands, 
            with real-time updates and intelligent automation.
          </p>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <TiltCard className="max-w-4xl mx-auto">
            <DashboardMock />
          </TiltCard>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <a 
            href="/login"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Explore all features
            <ChevronRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
