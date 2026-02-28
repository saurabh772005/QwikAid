import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Check,
  Heart,
  Users,
  Zap,
  Phone,
  ExternalLink
} from 'lucide-react';

const insurancePlans = [
  {
    id: 'basic',
    name: 'QwikAid Basic',
    provider: 'QwikAid Insurance',
    premium: 299,
    coverage: 200000,
    icon: Heart,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    popular: false,
    features: [
      'Emergency ambulance coverage',
      'Hospitalization expenses',
      'Day care procedures',
      'Pre & post hospitalization',
      'Cashless treatment at 500+ hospitals',
    ],
    notIncluded: [
      'Maternity coverage',
      'Critical illness',
      'International treatment',
    ],
  },
  {
    id: 'family',
    name: 'QwikAid Family',
    provider: 'QwikAid Insurance',
    premium: 799,
    coverage: 500000,
    icon: Users,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    popular: true,
    features: [
      'Coverage for entire family (up to 6)',
      'Emergency ambulance coverage',
      'Hospitalization expenses',
      'Maternity coverage',
      'Day care procedures',
      'Pre & post hospitalization',
      'Cashless treatment at 500+ hospitals',
      'Annual health checkup',
    ],
    notIncluded: [
      'Critical illness',
      'International treatment',
    ],
  },
  {
    id: 'premium',
    name: 'QwikAid Premium',
    provider: 'QwikAid Insurance',
    premium: 1499,
    coverage: 1000000,
    icon: Zap,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    popular: false,
    features: [
      'Coverage for entire family (up to 8)',
      'Emergency ambulance coverage',
      'Hospitalization expenses',
      'Maternity coverage',
      'Critical illness coverage',
      'Day care procedures',
      'Pre & post hospitalization',
      'Cashless treatment at 1000+ hospitals',
      'Annual health checkup',
      'International treatment coverage',
      'Air ambulance (up to ₹1 lakh)',
    ],
    notIncluded: [],
  },
];

const partnerInsurers = [
  { name: 'Star Health', logo: '⭐' },
  { name: 'ICICI Lombard', logo: '🏦' },
  { name: 'HDFC Ergo', logo: '🏛️' },
  { name: 'Bajaj Allianz', logo: '🛡️' },
  { name: 'New India Assurance', logo: '🇮🇳' },
  { name: 'Oriental Insurance', logo: '🌟' },
];

export default function InsurancePage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Health Insurance</h1>
            <p className="text-gray-400">Compare and choose the best health insurance plans</p>
          </div>
        </div>
      </motion.div>

      {/* Partner Insurers */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="text-gray-400 text-sm mb-4">Trusted insurance partners</p>
        <div className="flex flex-wrap gap-4">
          {partnerInsurers.map((insurer, index) => (
            <motion.div
              key={insurer.name}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-xl">{insurer.logo}</span>
              <span className="text-gray-300 text-sm">{insurer.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Insurance Plans */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {insurancePlans.map((plan, index) => (
          <motion.div
            key={plan.id}
            className={`relative bg-slate-900 border-2 rounded-2xl overflow-hidden ${
              plan.popular ? 'border-green-500/50' : 'border-slate-800'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                Most Popular
              </div>
            )}

            <div className="p-6">
              {/* Plan Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${plan.bgColor} rounded-xl flex items-center justify-center`}>
                  <plan.icon className={`w-6 h-6 ${plan.color}`} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.provider}</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-gray-400">₹</span>
                  <span className="text-4xl font-bold text-white">{plan.premium}</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <div className="text-green-400 text-sm mt-1">
                  Coverage up to ₹{plan.coverage.toLocaleString()}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <p className="text-gray-400 text-sm">What&apos;s included:</p>
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Not Included */}
              {plan.notIncluded.length > 0 && (
                <div className="space-y-2 mb-6">
                  <p className="text-gray-400 text-sm">Not included:</p>
                  {plan.notIncluded.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0">×</span>
                      <span className="text-gray-500 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA */}
              <motion.button
                className={`w-full py-3 font-semibold rounded-xl transition-colors ${
                  plan.popular
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPlan(plan.id)}
              >
                Choose Plan
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contact CTA */}
      <motion.div
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">Need help choosing?</h3>
            <p className="text-blue-100 text-sm">Talk to our insurance experts for personalized recommendations</p>
          </div>
          <div className="flex gap-3">
            <a
              href="tel:+911800123456"
              className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Us
            </a>
            <a
              href="https://qwikaid.com/insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-blue-600 font-medium rounded-xl transition-colors"
            >
              Learn More
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Plan Selection Modal */}
      {selectedPlan && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedPlan(null)}
        >
          <motion.div
            className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Plan Selected!</h3>
              <p className="text-gray-400">
                You&apos;ve selected the {insurancePlans.find(p => p.id === selectedPlan)?.name} plan.
              </p>
            </div>

            <div className="bg-slate-800 rounded-xl p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Monthly Premium</span>
                <span className="text-white font-semibold">
                  ₹{insurancePlans.find(p => p.id === selectedPlan)?.premium}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Coverage</span>
                <span className="text-green-400 font-semibold">
                  ₹{insurancePlans.find(p => p.id === selectedPlan)?.coverage.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedPlan(null)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('This would redirect to the payment/registration page');
                  setSelectedPlan(null);
                }}
                className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
              >
                Proceed
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
