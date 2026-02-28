import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui-custom';
import { Clock, Heart, Building2, Users, Activity, Shield } from 'lucide-react';

const metrics = [
  {
    value: 50000,
    suffix: '+',
    label: 'Emergencies Handled',
    icon: <Heart className="w-6 h-6" />,
  },
  {
    value: 500,
    suffix: '+',
    label: 'Partner Hospitals',
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    value: 1200,
    suffix: '+',
    label: 'Active Ambulances',
    icon: <Activity className="w-6 h-6" />,
  },
  {
    value: 2,
    suffix: ' min',
    label: 'Average Response Time',
    icon: <Clock className="w-6 h-6" />,
  },
  {
    value: 1000000,
    suffix: '+',
    label: 'Lives Protected',
    icon: <Shield className="w-6 h-6" />,
  },
  {
    value: 5000,
    suffix: '+',
    label: 'Healthcare Professionals',
    icon: <Users className="w-6 h-6" />,
  },
];

export function TrustMetricsSection() {
  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Trusted Across India
          </motion.span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Making a Real Difference
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our numbers speak for themselves. We&apos;re committed to providing 
            the fastest and most reliable emergency response service in the country.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AnimatedCounter
                value={metric.value}
                suffix={metric.suffix}
                label={metric.label}
                icon={metric.icon}
                duration={2.5}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
