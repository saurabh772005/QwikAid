import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Search,
  Heart,
  Brain,
  Bone,
  Baby,
  Eye,
  Pill,
  ChevronRight,
  Stethoscope
} from 'lucide-react';

const healthCategories = [
  { id: 'cardiac', name: 'Cardiac Care', icon: Heart, color: 'text-red-400', bgColor: 'bg-red-500/10' },
  { id: 'neurology', name: 'Neurology', icon: Brain, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  { id: 'orthopedics', name: 'Orthopedics', icon: Bone, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  { id: 'pediatrics', name: 'Pediatrics', icon: Baby, color: 'text-pink-400', bgColor: 'bg-pink-500/10' },
  { id: 'ophthalmology', name: 'Eye Care', icon: Eye, color: 'text-green-400', bgColor: 'bg-green-500/10' },
  { id: 'general', name: 'General Health', icon: Stethoscope, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
];

const healthTopics = [
  {
    id: '1',
    title: 'Heart Attack Warning Signs',
    category: 'cardiac',
    description: 'Learn to recognize the early warning signs of a heart attack and when to seek immediate medical attention.',
    symptoms: ['Chest pain', 'Shortness of breath', 'Nausea', 'Cold sweat'],
    actions: ['Call emergency services immediately', 'Chew aspirin if available', 'Stay calm and rest'],
  },
  {
    id: '2',
    title: 'Stroke Recognition - FAST',
    category: 'neurology',
    description: 'Remember FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency.',
    symptoms: ['Face drooping', 'Arm weakness', 'Speech difficulty', 'Sudden confusion'],
    actions: ['Call emergency services immediately', 'Note the time symptoms started', 'Keep person comfortable'],
  },
  {
    id: '3',
    title: 'Fracture First Aid',
    category: 'orthopedics',
    description: 'Proper first aid for suspected fractures can prevent further injury and complications.',
    symptoms: ['Severe pain', 'Swelling', 'Deformity', 'Inability to move'],
    actions: ['Immobilize the area', 'Apply ice pack', 'Seek medical help'],
  },
  {
    id: '4',
    title: 'Child Fever Management',
    category: 'pediatrics',
    description: 'Understanding when a child\'s fever requires immediate medical attention.',
    symptoms: ['Temperature > 103°F', 'Rash', 'Stiff neck', 'Difficulty breathing'],
    actions: ['Keep child hydrated', 'Use fever reducer', 'Monitor closely'],
  },
  {
    id: '5',
    title: 'Eye Injury Care',
    category: 'ophthalmology',
    description: 'Immediate steps to take when dealing with eye injuries or foreign objects.',
    symptoms: ['Pain', 'Redness', 'Vision changes', 'Tearing'],
    actions: ['Do not rub eye', 'Rinse with clean water', 'Seek immediate care'],
  },
  {
    id: '6',
    title: 'Diabetes Emergency',
    category: 'general',
    description: 'Recognizing and managing diabetic emergencies like hypoglycemia and hyperglycemia.',
    symptoms: ['Shakiness', 'Confusion', 'Excessive thirst', 'Frequent urination'],
    actions: ['Check blood sugar', 'Give sugar if low', 'Call doctor if high'],
  },
];

export default function HealthcareGuidancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<typeof healthTopics[0] | null>(null);

  const filteredTopics = healthTopics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Healthcare Guidance</h1>
            <p className="text-gray-400">Expert medical guidance for emergencies and first aid</p>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search health topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
        <div className="flex flex-wrap gap-3">
          <motion.button
            className={`px-4 py-2 rounded-xl border-2 transition-all ${selectedCategory === null
                ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                : 'border-slate-800 bg-slate-900 text-gray-400 hover:border-slate-700'
              }`}
            onClick={() => setSelectedCategory(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All Topics
          </motion.button>
          {healthCategories.map((category) => (
            <motion.button
              key={category.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${selectedCategory === category.id
                  ? `border-${category.color.split('-')[1]}-500 ${category.bgColor} ${category.color}`
                  : 'border-slate-800 bg-slate-900 text-gray-400 hover:border-slate-700'
                }`}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Topics Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredTopics.map((topic, index) => {
          const category = healthCategories.find(c => c.id === topic.category);
          return (
            <motion.div
              key={topic.id}
              className="p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-500/30 transition-colors cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => setSelectedTopic(topic)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${category?.bgColor || 'bg-slate-800'} rounded-lg flex items-center justify-center`}>
                  {category && <category.icon className={`w-5 h-5 ${category.color}`} />}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </div>
              <h3 className="text-white font-semibold mb-2">{topic.title}</h3>
              <p className="text-gray-400 text-sm mb-3">{topic.description}</p>
              <div className="flex flex-wrap gap-2">
                {topic.symptoms.slice(0, 3).map((symptom, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-800 text-gray-300 text-xs rounded-lg">
                    {symptom}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Topic Detail Modal */}
      {selectedTopic && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedTopic(null)}
        >
          <motion.div
            className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{selectedTopic.title}</h3>
              <button
                onClick={() => setSelectedTopic(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-400 mb-6">{selectedTopic.description}</p>

            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-400" />
                Warning Signs
              </h4>
              <ul className="space-y-2">
                {selectedTopic.symptoms.map((symptom, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                    {symptom}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Pill className="w-4 h-4 text-green-400" />
                Immediate Actions
              </h4>
              <ul className="space-y-2">
                {selectedTopic.actions.map((action, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
