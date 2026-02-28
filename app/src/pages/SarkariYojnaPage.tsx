import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  ExternalLink, 
  CheckCircle, 
  Users, 
  Wallet,
  Heart,
  Stethoscope,
  Baby,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const yojnaSchemes = [
  {
    id: 'ayushman',
    name: 'Ayushman Bharat (PM-JAY)',
    description: 'World\'s largest government-funded healthcare scheme providing health coverage up to ₹5 lakhs per family per year for secondary and tertiary care hospitalization.',
    icon: Heart,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    eligibility: [
      'Families identified in SECC 2011 database',
      'No restriction on family size or age',
      'Pre-existing diseases covered from day one',
    ],
    benefits: [
      'Health cover up to ₹5 lakhs per family per year',
      'Covers 1,500+ medical procedures',
      'Cashless treatment at empaneled hospitals',
      'Pre and post hospitalization expenses covered',
    ],
    documents: [
      'Aadhaar Card',
      'PM-JAY e-card or verification ID',
      'Income certificate (if applicable)',
    ],
    website: 'https://pmjay.gov.in',
  },
  {
    id: 'jsy',
    name: 'Janani Suraksha Yojana (JSY)',
    description: 'Safe motherhood intervention scheme promoting institutional delivery among poor pregnant women to reduce maternal and neonatal mortality.',
    icon: Baby,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    eligibility: [
      'Pregnant women from BPL families',
      'Women from rural and urban areas',
      'Age 19 years and above',
    ],
    benefits: [
      'Cash assistance for institutional delivery',
      '₹1,400 for rural areas, ₹1,000 for urban areas',
      'Free delivery at government hospitals',
      'Post-delivery care and checkups',
    ],
    documents: [
      'BPL Ration Card',
      'Aadhaar Card',
      'Mother and Child Protection Card',
      'Bank account details',
    ],
    website: 'https://nhm.gov.in',
  },
  {
    id: 'jssk',
    name: 'Janani Shishu Suraksha Karyakram (JSSK)',
    description: 'Scheme providing free entitlements to pregnant women and sick newborns for maternal and newborn health services.',
    icon: Stethoscope,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    eligibility: [
      'All pregnant women delivering in government institutions',
      'All sick newborns up to 30 days',
      'No income or BPL criteria',
    ],
    benefits: [
      'Free drugs and consumables',
      'Free diagnostics and diet',
      'Free blood transfusion if needed',
      'Free transport from home to facility',
    ],
    documents: [
      'Aadhaar Card',
      'Pregnancy registration card',
      'Address proof',
    ],
    website: 'https://nhm.gov.in',
  },
  {
    id: 'rsby',
    name: 'Rashtriya Swasthya Bima Yojana (RSBY)',
    description: 'Health insurance scheme for BPL families providing coverage for hospitalization expenses up to ₹30,000.',
    icon: Wallet,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    eligibility: [
      'BPL families as per state BPL list',
      'Unorganized sector workers',
      'MNRGS beneficiaries',
    ],
    benefits: [
      'Hospitalization coverage up to ₹30,000',
      'Coverage for 5 family members',
      'Cashless treatment at empaneled hospitals',
      'Pre-existing conditions covered',
    ],
    documents: [
      'BPL Card or RSBY card',
      'Aadhaar Card',
      'Passport size photographs',
      'Bank account details',
    ],
    website: 'https://www.rsby.gov.in',
  },
  {
    id: 'pmssy',
    name: 'Pradhan Mantri Swasthya Suraksha Yojana (PMSSY)',
    description: 'Scheme aimed at correcting regional imbalances in quality tertiary healthcare and achieving self-sufficiency in graduate and postgraduate medical education.',
    icon: Users,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    eligibility: [
      'All citizens for treatment at AIIMS-like institutions',
      'Students seeking medical education',
      'Patients requiring super-specialty care',
    ],
    benefits: [
      'Access to AIIMS-level healthcare facilities',
      'Affordable super-specialty treatment',
      'Increased medical education seats',
      'Quality healthcare in underserved regions',
    ],
    documents: [
      'Aadhaar Card',
      'Income certificate',
      'Medical referral (if applicable)',
      'Residence proof',
    ],
    website: 'https://pmssy-mohfw.nic.in',
  },
  {
    id: 'uhid',
    name: 'Universal Health Id (UHID) / ABHA',
    description: 'Digital health ID system creating unique health identities for citizens to store and access health records digitally.',
    icon: FileText,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    eligibility: [
      'All Indian citizens',
      'NRI with Indian origin',
      'No age restrictions',
    ],
    benefits: [
      'Unique digital health identity',
      'Access to health records anywhere',
      'Secure storage of medical history',
      'Easy sharing with healthcare providers',
    ],
    documents: [
      'Aadhaar Card',
      'Mobile number linked to Aadhaar',
      'Email address (optional)',
    ],
    website: 'https://healthid.ndhm.gov.in',
  },
];

export default function SarkariYojnaPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Sarkari Health Yojna</h1>
            <p className="text-gray-400">Government health schemes and benefits</p>
          </div>
        </div>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        className="mb-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="text-blue-300 text-sm">
          <strong>Note:</strong> These are government health schemes available to eligible citizens. 
          Click on any scheme to view detailed information about eligibility, benefits, and required documents.
        </p>
      </motion.div>

      {/* Schemes List */}
      <div className="space-y-4">
        {yojnaSchemes.map((scheme, index) => (
          <motion.div
            key={scheme.id}
            className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            {/* Scheme Header */}
            <button
              className="w-full p-5 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
              onClick={() => setExpandedId(expandedId === scheme.id ? null : scheme.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${scheme.bgColor} rounded-xl flex items-center justify-center`}>
                  <scheme.icon className={`w-6 h-6 ${scheme.color}`} />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">{scheme.name}</h3>
                  <p className="text-gray-400 text-sm line-clamp-1">{scheme.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={scheme.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
                {expandedId === scheme.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {/* Expanded Content */}
            {expandedId === scheme.id && (
              <motion.div
                className="border-t border-slate-800 p-5"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Eligibility */}
                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Eligibility
                    </h4>
                    <ul className="space-y-2">
                      {scheme.eligibility.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-blue-400" />
                      Benefits
                    </h4>
                    <ul className="space-y-2">
                      {scheme.benefits.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Documents */}
                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-yellow-400" />
                      Required Documents
                    </h4>
                    <ul className="space-y-2">
                      {scheme.documents.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                          <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="mt-6 pt-4 border-t border-slate-800">
                  <a
                    href={scheme.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
                  >
                    Apply Online
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
