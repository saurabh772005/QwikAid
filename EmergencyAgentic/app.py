from flask import Flask, jsonify, request, send_from_directory
from flask_socketio import SocketIO, join_room
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, decode_token
import os
import time
from datetime import timedelta

from models import db, User, EmergencyCase
from orchestrator import Orchestrator
from Agents.chatbot_engine import get_chat_response

app = Flask(__name__, static_folder="../app/dist", static_url_path="/")
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'emergency_secret')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///qwikaid.db')
if app.config['SQLALCHEMY_DATABASE_URI'].startswith("postgres://"):
    app.config['SQLALCHEMY_DATABASE_URI'] = app.config['SQLALCHEMY_DATABASE_URI'].replace("postgres://", "postgresql://", 1)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt_secret_special')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
CORS(app, resources={r"/api/*": {"origins": [frontend_url, "http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"]}}, supports_credentials=True)
db.init_app(app)
jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet', logger=True, engineio_logger=True)

orchestrator = Orchestrator(socketio, app)

# Initialize Database
with app.app_context():
    db.create_all()

@app.route("/", methods=["GET"])
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/<path:path>")
def serve_static(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "online",
        "service": "QwikAid Emergency API (Secured)",
        "database": "SQLite Persistent"
    })

# ==================================
# Auth Endpoints
# ==================================

@app.route("/api/auth/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()
        print(f"DEBUG: Signup request data: {data}")
        name = data.get("name")
        email = data.get("email")
        phone = data.get("phone")
        password = data.get("password")
        role = data.get("role", "user")

        if not all([name, email, phone, password]):
            return jsonify({"error": "Missing required fields"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already registered"}), 400
        if User.query.filter_by(phone=phone).first():
            return jsonify({"error": "Phone already registered"}), 400

        user = User(name=name, email=email, phone=phone, role=role)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            "access_token": access_token,
            "user": user.to_dict()
        }), 201
    except Exception as e:
        print(f"ERROR in signup: {str(e)}")
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

@app.route("/api/auth/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        print(f"DEBUG: Login request data: {data}")
        email = data.get("email")
        password = data.get("password")

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({"error": "Invalid email or password"}), 401

        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            "access_token": access_token,
            "user": user.to_dict()
        })
    except Exception as e:
        print(f"ERROR in login: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/auth/me", methods=["GET"])
@jwt_required()
def get_me():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ==================================
# Socket.IO Events
# ==================================

@socketio.on('connect')
def on_connect(auth):
    token = auth.get('token') if auth else None
    if not token:
        print("Socket connection rejected: No token provided")
        return False
    try:
        decoded = decode_token(token)
        user_id = decoded['sub']
        print(f"Socket authenticated connected for user_id: {user_id}")
    except Exception as e:
        print(f"Socket connection rejected: Invalid token - {str(e)}")
        return False

@socketio.on('join')
def on_join(data):
    case_id = data.get('case_id')
    if case_id:
        room = case_id
        join_room(room)
        print(f"Client joined room: {room}")

@socketio.on("join_case_room")
def handle_join(data):
    case_id = data["case_id"]
    join_room(case_id)
    print("Joined room:", case_id)

@socketio.on("start_workflow")
def start_workflow(data):
    case_id = data["case_id"]
    print(f"Frontend confirmed join. Starting background workflow for {case_id}")
    socketio.start_background_task(orchestrator.run_workflow, case_id)

@socketio.on('join_doctor_room')
def on_join_doctor(data):
    join_room("doctors")
    print("Doctor joined doctor room")

@socketio.on('chat_message')
def handle_chat_message(data):
    user_id = data.get('user_id')
    message = data.get('message')
    
    if not message:
        return
        
    print(f"Received chat from {user_id}: {message}")
    
    # Process message via AI Engine
    response_data = get_chat_response(message)
    
    # Send reply back to the specific client
    # The client can listen for 'chat_reply'
    # Request SID isn't needed if we emit back to the socket session directly
    socketio.emit('chat_reply', response_data, to=request.sid)

latest_user_locations = {}

@socketio.on('location_update')
def on_location_update(data):
    # Get user_id from the authenticated session
    try:
        token = request.args.get('token') or (request.sid if hasattr(request, 'sid') else 'anonymous')
        # Actually it's easier to just use the data if provided, but let's be safe
        user_id = data.get('user_id', 'anonymous')
        lat = data.get('lat')
        lng = data.get('lng')
        case_id = data.get('case_id')
        
        if lat and lng:
            latest_user_locations[user_id] = {"lat": lat, "lng": lng}
            print(f"Updated location for {user_id}: {lat}, {lng} (Case: {case_id})")
            
            if case_id:
                # Broadcast patient movement to the case room
                socketio.emit('patient_location_update', {
                    "lat": lat,
                    "lng": lng,
                    "case_id": case_id
                }, room=case_id)
    except Exception as e:
        print(f"Error in location_update: {str(e)}")

# ==================================
# Protected REST API Endpoints
# ==================================

@app.route("/api/emergency/start", methods=["POST"])
@jwt_required()
def start_emergency():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user.role != 'user':
        return jsonify({"error": "Only users can initiate an emergency"}), 403

    try:
        data = request.get_json()
        user_input = data.get("message")
        lat = data.get("lat")
        lng = data.get("lng")

        if not user_input or lat is None or lng is None:
            return jsonify({"error": "Missing required fields"}), 400

        case_id = f"CASE-{int(time.time())}"
        
        case = EmergencyCase(
            case_id=case_id,
            user_id=user_id,
            lat=lat,
            lng=lng,
            symptoms=user_input
        )
        db.session.add(case)
        db.session.commit()

        # Orchestration is NO LONGER started here. 
        # The frontend must emit "start_workflow" after confirming it joined the socket room!

        return jsonify({
            "message": "Emergency initiated",
            "case_id": case_id
        })

    except Exception as e:
        print("ERROR /api/emergency/start:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route("/api/doctor-requests", methods=["GET"])
@jwt_required()
def doctor_requests():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user.role != 'doctor':
        return jsonify({"error": "Access denied"}), 403

    active = EmergencyCase.query.filter(EmergencyCase.status.in_(["Triaged", "Hospital Selected", "Doctor Assigned", "Initiated"])).all()
    return jsonify([c.to_dict() for c in active])

@app.route("/api/doctor-history", methods=["GET"])
@jwt_required()
def doctor_history():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user.role != 'doctor':
        return jsonify({"error": "Access denied"}), 403

    history = EmergencyCase.query.filter(~EmergencyCase.status.in_(["Triaged", "Hospital Selected", "Doctor Assigned", "Initiated"])).all()
    return jsonify([c.to_dict() for c in history])

@app.route("/api/cases", methods=["GET"])
@jwt_required()
def get_all_cases():
    cases = EmergencyCase.query.all()
    return jsonify([c.to_dict() for c in cases])

@app.route("/api/emergency/<string:case_id>", methods=["GET"])
@jwt_required()
def get_case(case_id):
    case = EmergencyCase.query.filter_by(case_id=case_id).first()
    if not case:
        return jsonify({"error": "Case not found"}), 404
    return jsonify(case.to_dict())

@app.route("/api/doctor/accept/<string:case_id>", methods=["POST"])
@jwt_required()
def accept_case(case_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user.role != 'doctor':
        return jsonify({"error": "Only doctors can accept cases"}), 403

    data = request.get_json()
    doctor_info = data.get("doctor", {"name": user.name, "specialty": "Emergency Lead"})
    
    case = EmergencyCase.query.filter_by(case_id=case_id).first()
    if not case:
        return jsonify({"error": "Case not found"}), 404
        
    orchestrator.accept_case(case_id, doctor_info)
    return jsonify({"message": "Case accepted"})

@app.route("/api/doctor/reject/<string:case_id>", methods=["POST"])
@jwt_required()
def reject_case(case_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user.role != 'doctor':
        return jsonify({"error": "Access denied"}), 403

    case = EmergencyCase.query.filter_by(case_id=case_id).first()
    if not case:
        return jsonify({"error": "Case not found"}), 404
        
    case.add_timeline_event("Doctor Rejected", f"Reason: Unavailable (Dr. {user.name})")
    db.session.commit()
    
    socketio.emit('doctor_rejected', {"case_id": case_id}, room=f"case_{case_id}")
    orchestrator.notify_doctor(case_id)
    
    return jsonify({"message": "Case rejected, escalating..."})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    socketio.run(app, host="0.0.0.0", port=port)