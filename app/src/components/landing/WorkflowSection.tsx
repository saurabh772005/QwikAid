import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  Activity, 
  Building2, 
  Ambulance, 
  Bed, 
  Stethoscope, 
  CheckCircle 
} from 'lucide-react';

const workflowSteps = [
  {
    icon: <AlertCircle className="w-6 h-6" />,
    title: 'Emergency Trigger',
    description: 'User initiates emergency request through app or hotline',
  },
  {
    icon: <Activity className="w-6 h-6" />,
    title: 'Severity Score',
    description: 'AI assesses situation and assigns priority level',
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    title: 'Hospital Match',
    description: 'System finds optimal hospital based on specialty & distance',
  },
  {
    icon: <Ambulance className="w-6 h-6" />,
    title: 'Ambulance Dispatch',
    description: 'Nearest available ambulance is automatically dispatched',
  },
  {
    icon: <Bed className="w-6 h-6" />,
    title: 'Bed Reservation',
    description: 'Emergency bed is reserved before ambulance arrival',
  },
  {
    icon: <Stethoscope className="w-6 h-6" />,
    title: 'Doctor Escalation',
    description: 'Specialist doctor is assigned and notified',
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: 'Confirmation',
    description: 'All parties connected with real-time updates',
  },
];

export function WorkflowSection() {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 text-green-400 text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Seamless Emergency Workflow
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our AI-powered platform orchestrates every step of the emergency response, 
            ensuring no time is wasted and every patient gets the care they need.
          </p>
        </motion.div>

        {/* Workflow Timeline */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: 'easeOut' }}
              style={{ originX: 0 }}
            />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div
                  className="flex flex-col items-center text-center"
                  whileHover={{ y: -5 }}
                >
                  {/* Icon Circle */}
                  <motion.div
                    className="relative w-16 h-16 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center mb-4 z-10"
                    whileHover={{ 
                      scale: 1.1,
                      borderColor: '#3b82f6',
                    }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <motion.div
                      className="text-slate-400"
                      whileHover={{ color: '#3b82f6' }}
                    >
                      {step.icon}
                    </motion.div>
                    
                    {/* Glow Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-blue-500/20 blur-md"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />

                    {/* Step Number */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-white font-semibold mb-2 text-sm">{step.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{step.description}</p>
                </motion.div>

                {/* Arrow - Mobile/Tablet */}
                {index < workflowSteps.length - 1 && (
                  <motion.div
                    className="lg:hidden flex justify-center my-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <div className="w-0.5 h-8 bg-gradient-to-b from-blue-500 to-cyan-500" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {[
            { value: '7', label: 'Steps' },
            { value: '< 2', label: 'Minutes' },
            { value: '100%', label: 'Coordinated' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
