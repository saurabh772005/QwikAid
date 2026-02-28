import threading
import json
from models import db, EmergencyCase

class Orchestrator:
    def __init__(self, socketio, app):
        self.socketio = socketio
        self.app = app
        self.escalation_timers = {}

    def accept_case(self, case_id, doctor_info):
        with self.app.app_context():
            case = EmergencyCase.query.filter_by(case_id=case_id).first()
            if case:
                case.status = "Doctor Assigned"
                db.session.commit()
                # Notify the emergency room that a doctor has been assigned
                self.socketio.emit("doctor_assigned", {"doctor": doctor_info["name"]}, room=case_id)

    def run_workflow(self, case_id):
        print(f"RUNNING DUMMY WORKFLOW FOR {case_id}")
        
        self.socketio.sleep(1)
        self.socketio.emit("severity_calculated", {"score": 70}, room=case_id)

        self.socketio.sleep(2)
        self.socketio.emit("hospital_selected", {"hospital": "Aakash Healthcare Super Speciality Hospital, Dwarka"}, room=case_id)

        self.socketio.sleep(2)
        self.socketio.emit("ambulance_dispatched", {"eta": "8 mins"}, room=case_id)

        # Start simulated real-time tracking
        self.socketio.start_background_task(self.simulate_ambulance_route, case_id)

        self.socketio.sleep(2)
        self.socketio.emit("bed_reserved", {"bed": "ICU-12"}, room=case_id)

        self.socketio.sleep(2)
        self.socketio.emit("doctor_assigned", {"doctor": "Dr. Sharma"}, room=case_id)

    def simulate_ambulance_route(self, case_id):
        print(f"STARTING AMBULANCE SIMULATION FOR {case_id}")
        
        # FETCH CASE FROM DB to get actual patient coordinates
        with self.app.app_context():
            case = EmergencyCase.query.filter_by(case_id=case_id).first()
            if not case:
                print(f"ERROR: Case {case_id} not found for simulation")
                return
            
            # Destination is the patient's actual location
            end_lat = case.lat
            end_lng = case.lng

        # Dummy starting point - let's make it slightly away from the patient
        # This makes the simulation relevant to the user's current view
        start_lat = end_lat + 0.008  # Approx 1km north
        start_lng = end_lng + 0.008  # Approx 1km east

        total_steps = 30  # Increased steps for a smoother movement (30 seconds)

        for step in range(total_steps):
            progress = step / total_steps
            
            # Smooth interpolation
            current_lat = start_lat + (end_lat - start_lat) * progress
            current_lng = start_lng + (end_lng - start_lng) * progress
            remaining_time = (total_steps - step) * 2  # Fake ETA in seconds (scaling it up)

            self.socketio.emit("ambulance_location_update", {
                "lat": current_lat,
                "lng": current_lng,
                "eta": remaining_time,
                "start_lat": start_lat,
                "start_lng": start_lng,
                "end_lat": end_lat,
                "end_lng": end_lng
            }, room=case_id)

            self.socketio.sleep(1)

        # Complete workflow
        self.socketio.emit("ambulance_arrived", {
            "status": "Arrived at patient location"
        }, room=case_id)
        
        # Trigger final summary after arrival
        self.socketio.sleep(1)
        self.socketio.emit("case_confirmed", {"status": "completed"}, room=case_id)
