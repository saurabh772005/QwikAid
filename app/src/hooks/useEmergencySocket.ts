import { useEffect } from 'react';
import { socket } from '@/lib/socket';
import { useEmergencyStore } from '@/stores';
import { toast } from 'sonner';

export const useEmergencySocket = () => {
    const {
        caseId,
        setSeverity,
        setHospital,
        setAmbulance,
        setBedReservation,
        setDoctor,
        setCost,
        setStatus,
        updateTimeline,
    } = useEmergencyStore();

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        // 1. MUST REGISTER LISTENERS FIRST
        // Severity Assessment -> Step 2
        const onSeverity = (data: any) => {
            console.log('[Socket] severity_calculated', data);
            setSeverity({
                score: data.score || 70,
                level: 'critical',
                color: '#ef4444',
            });
            toast.success('Severity assessment complete');
        };
        socket.on('severity_calculated', onSeverity);

        // Hospital Selection -> Step 3
        const onHospital = (data: any) => {
            console.log('[Socket] hospital_selected', data);
            setHospital({
                id: Math.random().toString(),
                name: data.hospital || "Aakash Healthcare Super Speciality Hospital, Dwarka",
                address: 'Dwarka Sector 3, New Delhi',
                distance: parseFloat(data.distance || "4.2"),
                rating: 4.8,
                specialties: [],
                availableBeds: 5,
                phone: '911',
            });
            toast.info(`Hospital selected: ${data.hospital}`);
        };
        socket.on('hospital_selected', onHospital);

        // Ambulance Dispatch -> Step 4
        const onAmbulance = (data: any) => {
            console.log('[Socket] ambulance_dispatched', data);
            setAmbulance({
                id: 'AMB-001',
                vehicleNumber: 'DL 1C AA 1234',
                driverName: 'Ramesh Sharma',
                driverPhone: '+91 98765 43210',
                eta: parseInt(data.eta || "8"),
                currentLocation: { lat: 0, lng: 0 },
            });
            toast.info(`Ambulance dispatched! ETA: ${data.eta}`);
        };
        socket.on('ambulance_dispatched', onAmbulance);

        // Bed Reservation & Billing -> Step 5
        const onBed = (data: any) => {
            console.log('[Socket] bed_reserved', data);
            setBedReservation({
                id: 'BED-101',
                bedNumber: data.bed || "ICU-12",
                ward: "Trauma Center",
                reservedUntil: new Date(),
                timeRemaining: 15 * 60,
            });

            if (data.billing) {
                setCost({
                    baseCost: data.billing.base_cost,
                    ambulanceFee: data.billing.ambulance_fee,
                    bedFee: data.billing.bed_fee,
                    totalCost: data.billing.total_cost,
                });
            }
            toast.success('Emergency bed reserved');
        };
        socket.on('bed_reserved', onBed);

        // Doctor Assignment -> Step 6 (Completed)
        const onDoctor = (data: any) => {
            console.log('[Socket] doctor_assigned', data);
            setDoctor({
                id: "DOC-1",
                name: data.doctor || "Dr. Sharma",
                specialty: "Emergency",
                experience: 10,
                rating: 4.9,
                avatar: "",
                hospitalId: "",
            });
            toast.success(`Doctor assigned: ${data.doctor}`);
        };
        socket.on('doctor_assigned', onDoctor);

        // Case Confirmed -> Step 7
        const onConfirmed = (data: any) => {
            console.log('[Socket] case_confirmed', data);
            setStatus('completed');
            updateTimeline('7', 'completed');
            toast.success('Emergency setup finalized');
        };
        socket.on('case_confirmed', onConfirmed);

        // Backend Error Handling
        const onError = (data: any) => {
            console.log('[Socket] Backend error:', data);
            toast.error(data.error || 'Emergency process halted by Error');
            setStatus('scored');
        };
        socket.on('error', onError);

        // --- PHASE 12 LIVE TRACKING HACKATHON ADDITIONS ---

        const onAmbulanceLocationUpdate = (data: any) => {
            // console.log('[Socket] ambulance_location_update', data.eta); (spammy)
            useEmergencyStore.getState().setAmbulanceLocation({
                lat: data.lat,
                lng: data.lng,
                startLat: data.start_lat,
                startLng: data.start_lng,
                endLat: data.end_lat,
                endLng: data.end_lng
            }, data.eta);
        };
        socket.on('ambulance_location_update', onAmbulanceLocationUpdate);

        const onAmbulanceArrived = (data: any) => {
            console.log('[Socket] ambulance_arrived', data);
            useEmergencyStore.getState().setAmbulanceArrived();
            toast.success('Ambulance has arrived at your location.');
        };
        socket.on('ambulance_arrived', onAmbulanceArrived);


        // 2. ONLY START EMITTING AFTER LISTENERS ARE BOUND
        if (caseId) {
            console.log(`[Frontend] Emitting join_case_room: ${caseId}`);
            socket.emit('join_case_room', { case_id: caseId });

            // WAIT 500ms before triggering Start.
            setTimeout(() => {
                console.log(`[Frontend] Emitting start_workflow: ${caseId}`);
                socket.emit('start_workflow', { case_id: caseId });
            }, 500);
        }

        return () => {
            socket.off('severity_calculated', onSeverity);
            socket.off('hospital_selected', onHospital);
            socket.off('ambulance_dispatched', onAmbulance);
            socket.off('bed_reserved', onBed);
            socket.off('doctor_assigned', onDoctor);
            socket.off('case_confirmed', onConfirmed);
            socket.off('error', onError);
            socket.off('ambulance_location_update', onAmbulanceLocationUpdate);
            socket.off('ambulance_arrived', onAmbulanceArrived);
        };
    }, [caseId]);
};
