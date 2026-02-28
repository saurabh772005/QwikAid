import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Check,
  MapPin,
  Phone,
  User,
  Activity,
  Bed,
  Stethoscope,
  Star,
  Ambulance,
  CheckCircle,
  Search,
} from 'lucide-react';
import { useEmergencyStore } from '@/stores';
import { AnimatedGauge } from '@/components/ui-custom';
import type { Symptom } from '@/types';
import { useEmergencySocket } from '@/hooks/useEmergencySocket';
import { toast } from 'sonner';
import IncomingCallModal from '@/components/ui-custom/IncomingCallModal';
import DispatchCallModal from '@/components/ui-custom/DispatchCallModal';
import AmbulanceCustomLiveMap from '@/components/ui-custom/AmbulanceCustomLiveMap';

// Symptoms List
const symptomsList: { value: Symptom; label: string }[] = [
  { value: 'chest_pain', label: 'Chest Pain' },
  { value: 'difficulty_breathing', label: 'Difficulty Breathing' },
  { value: 'severe_bleeding', label: 'Severe Bleeding' },
  { value: 'unconsciousness', label: 'Unconsciousness' },
  { value: 'seizure', label: 'Seizure' },
  { value: 'stroke_symptoms', label: 'Stroke Symptoms' },
  { value: 'severe_allergic_reaction', label: 'Severe Allergic Reaction' },
  { value: 'burns', label: 'Burns' },
  { value: 'fracture', label: 'Fracture' },
  { value: 'head_injury', label: 'Head Injury' },
  { value: 'abdominal_pain', label: 'Severe Abdominal Pain' },
  { value: 'high_fever', label: 'High Fever' },
];

// Step 1: Situation Form
function SituationForm() {
  const { form, setForm, startEmergency } = useEmergencyStore();
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>(form.symptoms);
  const [loading, setLoading] = useState(false);

  const toggleSymptom = (symptom: Symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      setForm({ symptoms: selectedSymptoms });
      await startEmergency(`Emergency with symptoms: ${selectedSymptoms.join(', ')}`);
    } catch (error: any) {
      console.error('Failed to start emergency:', error);
      toast.error(error.message || 'Failed to start emergency');
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-6">Describe the Emergency</h3>

        <div className="mb-6">
          <label className="block text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-widest">Symptoms & Visible Injuries</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ description: e.target.value })}
            placeholder="Describe symptoms, visible injuries, or the nature of the emergency..."
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800 transition-colors h-24 resize-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">Symptoms (Select all that apply)</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {symptomsList.map((symptom) => (
              <motion.button
                key={symptom.value}
                type="button"
                className={`p-3 rounded-xl border-2 text-left transition-all ${selectedSymptoms.includes(symptom.value)
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-slate-700 bg-slate-800 text-gray-400 hover:border-slate-600'
                  }`}
                onClick={() => toggleSymptom(symptom.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {symptom.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">Breathing Status</label>
          <div className="grid grid-cols-3 gap-3">
            {(['normal', 'difficult', 'not_breathing'] as const).map((status) => (
              <button
                key={status}
                type="button"
                className={`p-3 rounded-xl border-2 capitalize transition-all ${form.breathing === status
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-slate-700 bg-slate-800 text-gray-400 hover:border-slate-600'
                  }`}
                onClick={() => setForm({ breathing: status })}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${form.ambulanceNeeded ? 'bg-blue-500 border-blue-500' : 'border-slate-700 bg-slate-800'
              }`}>
              {form.ambulanceNeeded && <Check className="w-4 h-4 text-white" />}
            </div>
            <input
              type="checkbox"
              checked={form.ambulanceNeeded}
              onChange={(e) => setForm({ ambulanceNeeded: e.target.checked })}
              className="hidden"
            />
            <span className="text-gray-300 group-hover:text-white transition-colors">Emergency Ambulance Needed</span>
          </label>
        </div>

        <motion.button
          onClick={handleSubmit}
          disabled={loading || selectedSymptoms.length === 0 || useEmergencyStore.getState().currentStage > 0}
          className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          whileHover={{ scale: (loading || useEmergencyStore.getState().currentStage > 0) ? 1 : 1.02 }}
          whileTap={{ scale: (loading || useEmergencyStore.getState().currentStage > 0) ? 1 : 0.98 }}
        >
          {loading ? (
            <Activity className="w-5 h-5 animate-pulse" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {loading ? 'Initiating...' : useEmergencyStore.getState().currentStage > 0 ? 'Assessment Locked' : 'Update Assessment'}
        </motion.button>
      </div>
    </motion.div>
  );
}

// Step 2: Severity Score
function SeverityAssessment() {
  const { severity, status } = useEmergencyStore();
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    if (!severity && status === 'scoring') {
      const timer = setTimeout(() => setDelayed(true), 10000);
      return () => clearTimeout(timer);
    }
  }, [severity, status]);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      {!severity ? (
        <div className="text-center py-8">
          <motion.div
            className="w-16 h-16 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Activity className="w-full h-full text-blue-500" />
          </motion.div>
          <h3 className="text-lg font-bold text-white mb-2">Analyzing Severity...</h3>
          <p className="text-sm text-gray-400">
            {delayed ? (
              <span className="text-orange-400">System delayed. Processing deep parameters...</span>
            ) : "AI Agents are evaluating your symptoms"}
          </p>
        </div>
      ) : (
        <div>
          <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider text-center">Current Severity Level</h3>
          <div className="flex justify-center mb-6">
            <AnimatedGauge
              value={severity.score}
              label={severity.level}
              sublabel=""
            />
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3 justify-center">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-sm font-medium">Activating emergency response agents...</span>
          </div>
          <div className="mt-4 text-xs text-gray-500 flex justify-between px-2">
            <span>● GPS Link</span>
            <span>● Vital Stream</span>
            <span>ENGINE: V4.2-A</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Step 3: Hospital Search
function HospitalSearch() {
  const { selectedHospital } = useEmergencyStore();

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      {!selectedHospital ? (
        <div className="text-center py-4">
          <motion.div
            className="w-12 h-12 mx-auto mb-3 relative"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Search className="w-full h-full text-blue-500" />
          </motion.div>
          <h3 className="text-md font-bold text-white">Matching Hospital...</h3>
        </div>
      ) : (
        <div className="text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Hospital Found</h3>
            </div>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl">
            <h4 className="text-md font-bold text-white mb-1">{selectedHospital.name}</h4>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{selectedHospital.distance} km</span>
              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-current" />{selectedHospital.rating}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Step 4: Ambulance Dispatch
function AmbulanceDispatch() {
  const { assignedAmbulance } = useEmergencyStore();

  if (!assignedAmbulance) {
    return (
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center shadow-xl">
        <motion.div
          className="w-12 h-12 mx-auto mb-3"
          animate={{ x: [-5, 5, -5] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          <Ambulance className="w-full h-full text-blue-500" />
        </motion.div>
        <h3 className="text-md font-bold text-white">Dispatching Unit...</h3>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
          <Ambulance className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">En Route</h3>
          <p className="text-sm text-gray-400">{assignedAmbulance.driverName} • {assignedAmbulance.vehicleNumber}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-blue-400">{assignedAmbulance.eta}</div>
        <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">ETA</div>
      </div>
    </div>
  );
}

// Step 5: Bed Reservation
function BedReservationComponent() {
  const { bedReservation } = useEmergencyStore();

  if (!bedReservation) {
    return (
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center shadow-xl">
        <motion.div
          className="w-12 h-12 mx-auto mb-3"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <Bed className="w-full h-full text-blue-500" />
        </motion.div>
        <h3 className="text-md font-bold text-white">Securing Trauma Bed...</h3>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
          <Bed className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Bed Secured</h3>
          <p className="text-sm text-gray-400">Ward {bedReservation.ward}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xl font-bold font-mono text-white bg-slate-800 px-3 py-1 rounded inline-block">{bedReservation.bedNumber}</div>
      </div>
    </div>
  );
}

// Step 6: Doctor Assignment
function DoctorAssignment() {
  const { assignedDoctor } = useEmergencyStore();

  if (!assignedDoctor) {
    return (
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center shadow-xl">
        <motion.div
          className="w-12 h-12 mx-auto mb-3"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <Stethoscope className="w-full h-full text-blue-500" />
        </motion.div>
        <h3 className="text-md font-bold text-white">Assigning Specialist...</h3>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center gap-4">
      <div className="w-14 h-14 bg-purple-500/20 rounded-full flex items-center justify-center shrink-0">
        <User className="w-7 h-7 text-purple-400" />
      </div>
      <div>
        <h3 className="text-md font-bold text-white">{assignedDoctor.name}</h3>
        <p className="text-sm text-purple-400">{assignedDoctor.specialty} Specialist</p>
        <div className="flex items-center gap-2 mt-1">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-xs text-gray-400">{assignedDoctor.rating} • {assignedDoctor.experience}y exp</span>
        </div>
      </div>
    </div>
  );
}

// Stage 6: Final Coordination Summary
function Confirmation({ onReset }: { onReset: () => void }) {
  const { cost, selectedHospital, assignedAmbulance, bedReservation, assignedDoctor, caseId, setDispatchCallStatus } = useEmergencyStore();

  return (
    <motion.div
      className="max-w-5xl mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Emergency Coordination Final Summary</h2>
        <p className="text-gray-400">All operational parameters have been locked and confirmed for Case #{caseId?.split('-')[0] || 'ER-90412'}.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column: Dispatch Checklist */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-blue-400" />
              Dispatch Checklist
            </h3>
            <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20 uppercase">All Secured</span>
          </div>

          <div className="space-y-4 relative z-10">
            {[
              { title: 'Ambulance Dispatched', detail: `Unit ${assignedAmbulance?.vehicleNumber || 'Alpha-04'} | ETA: ${assignedAmbulance?.eta || '8 mins'}` },
              { title: 'Hospital Selected', detail: `${selectedHospital?.name || 'St. Mary Medical Center'}` },
              { title: 'Bed Reserved', detail: `Ward ${bedReservation?.ward || 'ICU'} | Room ${bedReservation?.bedNumber || '402'}` },
              { title: 'Doctor Assigned', detail: `${assignedDoctor?.specialty || 'Surgical'} Team Prepped` }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.detail}</p>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Assigned Medical Team & Cost Breakdown */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Assigned Medical Team</h4>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-bold">{assignedDoctor?.name || 'Dr. Sarah Chen'}</h4>
                <p className="text-blue-400 text-sm">On-call {assignedDoctor?.specialty || 'Surgical'} Specialist</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Activity className="w-3 h-3" /> Bed Hold Timer</p>
                <p className="text-xl font-bold text-white font-mono">14:52</p>
              </div>
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Bed className="w-3 h-3" /> Bed ID</p>
                <p className="text-xl font-bold text-white">{bedReservation?.bedNumber || 'B-15'}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Estimated Cost Breakdown</h4>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm text-gray-400"><span>Emergency Dispatch</span><span>₹{cost?.ambulanceFee || 1250}</span></div>
              <div className="flex justify-between text-sm text-gray-400"><span>Specialist Consultation</span><span>₹{cost?.baseCost || 450}</span></div>
              <div className="flex justify-between text-sm text-gray-400"><span>Facility Reservation Fee</span><span>₹{cost?.bedFee || 320}</span></div>
            </div>
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
              <span className="text-white font-bold">Total Estimated</span>
              <span className="text-2xl font-bold text-blue-400">₹{cost?.totalCost || 2020}</span>
            </div>
            <p className="text-[10px] text-gray-600 mt-2 italic">*Estimates subject to insurance adjustment.</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0">
            <Activity className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Everything has been successfully arranged.</h3>
            <p className="text-gray-400">Help is on the way. Our systems are monitoring real-time arrival.</p>
          </div>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <button onClick={() => setDispatchCallStatus('dialing')} className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl whitespace-nowrap hover:bg-gray-100 transition flex items-center gap-2">
            <Phone className="w-5 h-5" /> Contact Dispatch
          </button>
          <button onClick={onReset} className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl whitespace-nowrap hover:bg-slate-700 transition">
            Close Case
          </button>
        </div>
      </div>

      <div className="mt-8 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl relative" style={{ height: "600px" }}>
        <AmbulanceCustomLiveMap />
      </div>
    </motion.div>
  );
}

export default function EmergencyPage() {
  const { currentStage, resetEmergency, ambulanceLocation, hasReceivedCall, setCallStatus } = useEmergencyStore();

  useEmergencySocket();

  // Trigger Voice Agent Call 3 seconds after Update Assessment is clicked (Stage 1+)
  useEffect(() => {
    if (currentStage > 0 && !hasReceivedCall) {
      const timer = setTimeout(() => {
        setCallStatus('ringing');
      }, 3000); // 3 seconds delay
      return () => clearTimeout(timer);
    }
  }, [currentStage, hasReceivedCall, setCallStatus]);

  // If Stage 6, completely replace UI with Final Summary
  if (currentStage === 6) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Confirmation onReset={resetEmergency} />
        <IncomingCallModal />
        <DispatchCallModal />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        className="flex mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Emergency Assessment & Severity Engine</h1>
          <p className="text-gray-400 text-lg max-w-2xl">Real-time AI situation analysis and immediate emergency response coordination.</p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Form stays static */}
        <div className="sticky top-8">
          <SituationForm />
        </div>

        {/* Right Column: Progressive Stacking Output */}
        <div className="flex flex-col gap-6">
          <AnimatePresence>
            {currentStage >= 1 && (
              <motion.div key="stage1" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <SeverityAssessment />
              </motion.div>
            )}
            {currentStage >= 2 && (
              <motion.div key="stage2" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                <HospitalSearch />
              </motion.div>
            )}
            {currentStage >= 3 && (
              <motion.div key="stage3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                <AmbulanceDispatch />
              </motion.div>
            )}
            {currentStage >= 4 && (
              <motion.div key="stage4" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                <BedReservationComponent />
              </motion.div>
            )}
            {currentStage >= 5 && (
              <motion.div key="stage5" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                <DoctorAssignment />
              </motion.div>
            )}

            {/* LIVE AMBULANCE TRACKING HERO */}
            {ambulanceLocation && (
              <motion.div key="livemap" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <div className="border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl relative" style={{ height: "500px" }}>
                  <AmbulanceCustomLiveMap />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {currentStage === 0 && (
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-800 rounded-3xl flex items-center justify-center text-gray-500">
              Awaiting situation assessment submission...
            </div>
          )}
        </div>
      </div>
      <IncomingCallModal />
      <DispatchCallModal />
    </div>
  );
}
