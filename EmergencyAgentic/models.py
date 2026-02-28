from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import json

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='user') # 'user' or 'doctor'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "role": self.role,
            "created_at": self.created_at.isoformat()
        }

class EmergencyCase(db.Model):
    __tablename__ = 'emergency_cases'
    
    id = db.Column(db.Integer, primary_key=True)
    case_id = db.Column(db.String(50), unique=True, nullable=False)
    user_id = db.Column(db.String(100), nullable=False)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    severity_score = db.Column(db.Integer)
    severity_level = db.Column(db.String(50))
    emergency_type = db.Column(db.String(100))
    required_specialist = db.Column(db.String(100))
    symptoms = db.Column(db.Text)
    
    # JSON fields for complexity
    location_data = db.Column(db.Text) # Store as JSON string
    hospital_data = db.Column(db.Text)
    ambulance_data = db.Column(db.Text)
    bed_data = db.Column(db.Text)
    doctor_data = db.Column(db.Text)
    cost_data = db.Column(db.Text)
    
    status = db.Column(db.String(50), default="Initiated")
    timeline_data = db.Column(db.Text) # Store as JSON list string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, **kwargs):
        super(EmergencyCase, self).__init__(**kwargs)
        if not self.timeline_data:
            self.timeline_data = json.dumps([
                {"event": "Case Created", "timestamp": datetime.utcnow().timestamp(), "details": "Emergency request started"}
            ])

    def add_timeline_event(self, event_name, details=""):
        timeline = json.loads(self.timeline_data or "[]")
        timeline.append({
            "event": event_name,
            "timestamp": datetime.utcnow().timestamp(),
            "details": details
        })
        self.timeline_data = json.dumps(timeline)

    def to_dict(self):
        return {
            "case_id": self.case_id,
            "user_id": self.user_id,
            "lat": self.lat,
            "lng": self.lng,
            "severity_score": self.severity_score,
            "severity_level": self.severity_level,
            "emergency_type": self.emergency_type,
            "location": json.loads(self.location_data) if self.location_data else None,
            "hospital": json.loads(self.hospital_data) if self.hospital_data else None,
            "ambulance": json.loads(self.ambulance_data) if self.ambulance_data else None,
            "bed": json.loads(self.bed_data) if self.bed_data else None,
            "doctor": json.loads(self.doctor_data) if self.doctor_data else None,
            "cost": json.loads(self.cost_data) if self.cost_data else None,
            "status": self.status,
            "symptoms": self.symptoms,
            "timeline": json.loads(self.timeline_data) if self.timeline_data else []
        }
