import { create } from 'zustand';
import type {
  EmergencyState,
  EmergencyForm,
  TimelineEvent
} from '@/types';

const initialForm: EmergencyForm = {
  symptoms: [],
  breathing: 'normal',
  consciousness: 'alert',
  bleeding: 'none',
  ambulanceNeeded: true,
  description: '',
};

const initialTimeline: TimelineEvent[] = [
  { id: '1', step: 'Emergency Trigger', status: 'pending', description: 'Initial emergency request' },
  { id: '2', step: 'Severity Score', status: 'pending', description: 'AI-powered severity assessment' },
  { id: '3', step: 'Hospital Match', status: 'pending', description: 'Finding optimal hospital' },
  { id: '4', step: 'Ambulance Dispatch', status: 'pending', description: 'Dispatching nearest ambulance' },
  { id: '5', step: 'Bed Reservation', status: 'pending', description: 'Reserving emergency bed' },
  { id: '6', step: 'Doctor Escalation', status: 'pending', description: 'Assigning specialist doctor' },
  { id: '7', step: 'Confirmation', status: 'pending', description: 'Emergency response confirmed' },
];

export const useEmergencyStore = create<EmergencyState>((set) => ({
  // Initial State
  caseId: null,
  cost: null,
  form: initialForm,
  severity: null,
  selectedHospital: null,
  assignedAmbulance: null,
  assignedDoctor: null,
  bedReservation: null,
  timeline: initialTimeline,
  status: 'idle',
  currentStep: 0,
  currentStage: 0,
  userLocation: null,
  ambulanceLocation: null,
  ambulanceEta: null,
  incidentLogs: [],
  callStatus: 'idle',
  hasReceivedCall: false,
  dispatchCallStatus: 'idle',

  // Actions
  setUserLocation: (userLocation) => set({ userLocation }),
  setCaseId: (caseId) => set({ caseId }),
  setForm: (formData) => set((state) => ({
    form: { ...state.form, ...formData }
  })),

  setSeverity: (severity) => set((state) => {
    const newTimeline = [...state.timeline];
    newTimeline[1] = { ...newTimeline[1], status: 'completed', timestamp: new Date() };
    newTimeline[2] = { ...newTimeline[2], status: 'in_progress' };
    return {
      severity,
      timeline: newTimeline,
      status: 'scored',
      currentStep: 2,
      currentStage: 1
    };
  }),

  setHospital: (hospital) => set((state) => {
    const newTimeline = [...state.timeline];
    newTimeline[2] = { ...newTimeline[2], status: 'completed', timestamp: new Date() };
    newTimeline[3] = { ...newTimeline[3], status: 'in_progress' };
    return {
      selectedHospital: hospital,
      timeline: newTimeline,
      status: 'hospital_found',
      currentStep: 3,
      currentStage: 2
    };
  }),

  setAmbulance: (ambulance) => set((state) => {
    const newTimeline = [...state.timeline];
    newTimeline[3] = { ...newTimeline[3], status: 'completed', timestamp: new Date() };
    newTimeline[4] = { ...newTimeline[4], status: 'in_progress' };
    return {
      assignedAmbulance: ambulance,
      timeline: newTimeline,
      status: 'ambulance_dispatched',
      currentStep: 4,
      currentStage: 3
    };
  }),

  setBedReservation: (bedReservation) => set((state) => {
    const newTimeline = [...state.timeline];
    newTimeline[4] = { ...newTimeline[4], status: 'completed', timestamp: new Date() };
    newTimeline[5] = { ...newTimeline[5], status: 'in_progress' };
    return {
      bedReservation,
      timeline: newTimeline,
      status: 'bed_reserved',
      currentStep: 5,
      currentStage: 4
    };
  }),

  setDoctor: (doctor) => set((state) => {
    const newTimeline = [...state.timeline];
    newTimeline[5] = { ...newTimeline[5], status: 'completed', timestamp: new Date() };
    newTimeline[6] = { ...newTimeline[6], status: 'completed', timestamp: new Date() };
    return {
      assignedDoctor: doctor,
      timeline: newTimeline,
      status: 'doctor_assigned',
      currentStep: 6,
      currentStage: 5
    };
  }),

  setAmbulanceLocation: (location, eta) => set({
    ambulanceLocation: location,
    ambulanceEta: eta
  }),

  addIncidentLog: (log) => set((state) => ({
    incidentLogs: [...state.incidentLogs, `[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}] ${log}`]
  })),

  setAmbulanceArrived: () => set((state) => ({
    status: 'completed',
    currentStage: 6,
    incidentLogs: [...state.incidentLogs, `[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}] Ambulance Arrived at Location`]
  })),

  setCallStatus: (callStatus) => set((state) => ({
    callStatus,
    hasReceivedCall: callStatus !== 'idle' ? true : state.hasReceivedCall
  })),

  setDispatchCallStatus: (dispatchCallStatus) => set({ dispatchCallStatus }),

  updateTimeline: (eventId, status) => set((state) => ({
    timeline: state.timeline.map(event =>
      event.id === eventId ? { ...event, status, timestamp: new Date() } : event
    )
  })),

  setStatus: (status) => set((state) => ({
    status,
    currentStage: status === 'completed' ? 6 : state.currentStage
  })),

  setCurrentStep: (currentStep) => set({ currentStep }),

  setCost: (cost) => set({ cost }),

  startEmergency: async (message: string) => {
    const { userLocation, form } = useEmergencyStore.getState();
    const token = localStorage.getItem('token');

    if (!userLocation) {
      throw new Error('Location access required to trigger emergency');
    }

    const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
    const response = await fetch(`${baseUrl}/api/emergency/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        message,
        lat: userLocation.lat,
        lng: userLocation.lng,
        ambulance_needed: form.ambulanceNeeded
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to start emergency');

    set({ caseId: data.case_id, status: 'scoring', currentStep: 1, currentStage: 1 });
    return data.case_id;
  },

  resetEmergency: () => set({
    caseId: null,
    cost: null,
    form: initialForm,
    severity: null,
    selectedHospital: null,
    assignedAmbulance: null,
    assignedDoctor: null,
    bedReservation: null,
    timeline: initialTimeline.map(t => ({ ...t, status: 'pending', timestamp: undefined })),
    status: 'idle',
    currentStep: 0,
    currentStage: 0,
    ambulanceLocation: null,
    ambulanceEta: null,
    incidentLogs: [],
    callStatus: 'idle',
    hasReceivedCall: false,
    dispatchCallStatus: 'idle',
  }),
}));
