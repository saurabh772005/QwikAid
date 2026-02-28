// User Types
export type UserRole = 'user' | 'doctor';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

// Emergency Types
export type EmergencyStatus =
  | 'idle'
  | 'assessing'
  | 'scoring'
  | 'scored'
  | 'searching_hospital'
  | 'hospital_found'
  | 'dispatching_ambulance'
  | 'ambulance_dispatched'
  | 'reserving_bed'
  | 'bed_reserved'
  | 'assigning_doctor'
  | 'doctor_assigned'
  | 'completed';

export type Symptom =
  | 'chest_pain'
  | 'difficulty_breathing'
  | 'severe_bleeding'
  | 'unconsciousness'
  | 'seizure'
  | 'stroke_symptoms'
  | 'severe_allergic_reaction'
  | 'burns'
  | 'fracture'
  | 'head_injury'
  | 'abdominal_pain'
  | 'high_fever';

export interface EmergencyForm {
  symptoms: Symptom[];
  breathing: 'normal' | 'difficult' | 'not_breathing';
  consciousness: 'alert' | 'confused' | 'unconscious';
  bleeding: 'none' | 'minor' | 'moderate' | 'severe';
  ambulanceNeeded: boolean;
  description: string;
}

export interface SeverityScore {
  score: number;
  level: 'low' | 'moderate' | 'high' | 'critical';
  color: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: number;
  rating: number;
  specialties: string[];
  availableBeds: number;
  phone: string;
  image?: string;
}

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  eta: number;
  currentLocation: {
    lat: number;
    lng: number;
  };
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  avatar?: string;
  hospitalId: string;
}

export interface BedReservation {
  id: string;
  bedNumber: string;
  ward: string;
  reservedUntil: Date;
  timeRemaining: number;
}

export interface TimelineEvent {
  id: string;
  step: string;
  status: 'pending' | 'in_progress' | 'completed';
  timestamp?: Date;
  description: string;
}

export interface EmergencyState {
  // Case ID and Cost
  caseId: string | null;
  cost: {
    baseCost: number;
    ambulanceFee: number;
    bedFee: number;
    totalCost: number;
  } | null;

  // Form Data
  form: EmergencyForm;

  // Assessment
  severity: SeverityScore | null;

  // Selected Resources
  selectedHospital: Hospital | null;
  assignedAmbulance: Ambulance | null;
  assignedDoctor: Doctor | null;
  bedReservation: BedReservation | null;

  // Timeline
  timeline: TimelineEvent[];

  // Status
  status: EmergencyStatus;
  currentStep: number;
  currentStage: number;
  userLocation: { lat: number; lng: number; areaName?: string } | null;
  ambulanceLocation: { lat: number; lng: number; startLat: number; startLng: number; endLat: number; endLng: number; } | null;
  ambulanceEta: number | null;
  incidentLogs: string[];

  // Call System
  callStatus: 'idle' | 'ringing' | 'connected' | 'ended';
  hasReceivedCall: boolean;
  dispatchCallStatus: 'idle' | 'dialing' | 'connected' | 'ended';

  // Actions
  setForm: (form: Partial<EmergencyForm>) => void;
  setSeverity: (severity: SeverityScore) => void;
  setHospital: (hospital: Hospital) => void;
  setAmbulance: (ambulance: Ambulance) => void;
  setDoctor: (doctor: Doctor) => void;
  setBedReservation: (bed: BedReservation) => void;
  updateTimeline: (eventId: string, status: TimelineEvent['status']) => void;
  setStatus: (status: EmergencyStatus) => void;
  setCurrentStep: (step: number) => void;
  setCaseId: (id: string) => void;
  setCost: (cost: EmergencyState['cost']) => void;
  setUserLocation: (location: { lat: number; lng: number; areaName?: string } | null) => void;
  setAmbulanceLocation: (location: { lat: number; lng: number; startLat: number; startLng: number; endLat: number; endLng: number; } | null, eta: number | null) => void;
  addIncidentLog: (log: string) => void;
  setAmbulanceArrived: () => void;
  setCallStatus: (status: 'idle' | 'ringing' | 'connected' | 'ended') => void;
  setDispatchCallStatus: (status: 'idle' | 'dialing' | 'connected' | 'ended') => void;
  startEmergency: (message: string) => Promise<string>;
  resetEmergency: () => void;
}

// Navigation Types
export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

// Insurance Types
export interface InsurancePlan {
  id: string;
  name: string;
  provider: string;
  coverage: number;
  premium: number;
  benefits: string[];
  icon?: string;
}

// Yojna Types
export interface YojnaScheme {
  id: string;
  name: string;
  description: string;
  eligibility: string[];
  benefits: string;
  documents: string[];
  applicationUrl: string;
}

// Guidance Types
export interface HealthTopic {
  id: string;
  title: string;
  category: string;
  content: string;
  icon?: string;
}
