import { motion } from 'framer-motion';

interface AnimatedGaugeProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export function AnimatedGauge({
  value,
  maxValue = 100,
  size = 200,
  strokeWidth = 12,
  color = '#10b981',
  label,
  sublabel,
}: AnimatedGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value / maxValue, 1);
  const dashoffset = circumference - progress * circumference;

  // Determine color based on value
  const getColor = () => {
    if (value >= 80) return '#ef4444'; // Red - Critical
    if (value >= 60) return '#f97316'; // Orange - High
    if (value >= 40) return '#eab308'; // Yellow - Moderate
    return '#10b981'; // Green - Low
  };

  const gaugeColor = color || getColor();

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background Circle */}
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={gaugeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 8px ${gaugeColor}50)`,
          }}
        />
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold"
          style={{ color: gaugeColor }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {value}
        </motion.span>
        {label && (
          <motion.span
            className="text-sm font-medium text-gray-600 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {label}
          </motion.span>
        )}
        {sublabel && (
          <motion.span
            className="text-xs text-gray-400 mt-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {sublabel}
          </motion.span>
        )}
      </div>

      {/* Pulse Effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ borderColor: gaugeColor }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0, 0.3, 0],
          scale: [0.8, 1.1, 1.2]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut'
        }}
      />
    </div>
  );
}
