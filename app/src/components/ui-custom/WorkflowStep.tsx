import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

interface WorkflowStepProps {
  step: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  index: number;
  isLast?: boolean;
}

export function WorkflowStep({
  step,
  description,
  status,
  index,
  isLast = false,
}: WorkflowStepProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 border-green-500';
      case 'in_progress':
        return 'bg-blue-500 border-blue-500';
      default:
        return 'bg-gray-200 border-gray-300';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'completed':
        return <Check className="w-5 h-5 text-white" />;
      case 'in_progress':
        return <Loader2 className="w-5 h-5 text-white animate-spin" />;
      default:
        return <span className="text-gray-400 text-sm font-medium">{index + 1}</span>;
    }
  };

  return (
    <div className="flex items-start">
      <div className="flex flex-col items-center">
        {/* Step Circle */}
        <motion.div
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${getStatusColor()}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: 'spring',
            stiffness: 400,
            damping: 20,
            delay: index * 0.1 
          }}
          whileHover={{ scale: 1.1 }}
        >
          {getIcon()}
        </motion.div>

        {/* Connecting Line */}
        {!isLast && (
          <motion.div
            className="w-0.5 h-16 bg-gray-200 mt-2"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
            style={{ originY: 0 }}
          >
            <motion.div
              className="w-full bg-blue-500"
              initial={{ height: '0%' }}
              animate={{ 
                height: status === 'completed' ? '100%' : 
                        status === 'in_progress' ? '50%' : '0%' 
              }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        )}
      </div>

      {/* Step Content */}
      <motion.div
        className="ml-4 pb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 + 0.1 }}
      >
        <h4 className={`font-semibold ${
          status === 'completed' ? 'text-green-600' :
          status === 'in_progress' ? 'text-blue-600' : 'text-gray-600'
        }`}>
          {step}
        </h4>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
        
        {status === 'in_progress' && (
          <motion.div
            className="flex items-center gap-2 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-xs text-blue-500">In Progress</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
