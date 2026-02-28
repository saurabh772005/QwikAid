import google.generativeai as genai
import os
import json

API_KEY = os.environ.get("GOOGLE_API_KEY")
if not API_KEY or API_KEY.strip() == "":
    API_KEY = "AIzaSyDbw8Lc53-s3DMPgXVx5JWLuwy6rexLMXY"
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')

SYSTEM_PROMPT = """
You are the QwikAid Health Assistant, a helpful and empathetic AI triage bot.
IMPORTANT RULES:
1. You provide home remedies and guidance for MINOR health issues (e.g., fever, mild cold, minor headache, small cuts, mild stomach pain).
2. You NEVER diagnose critical emergencies, prescribe specific medication dosages, or claim to replace a doctor.
3. If the user presents CRITICAL keywords (chest pain, unconscious, severe bleeding, stroke, seizure, not breathing, heart attack, severe trauma, poisoning):
   - Immediately classify severity_level as "critical".
   - Your reply MUST ALWAYS be: "This may be serious. Please trigger Emergency immediately."
4. If the issue is minor, provide 2-3 brief steps for home care, and always end with a disclaimer: "For minor issues only. Seek medical help if symptoms worsen."
5. Output MUST be ONLY valid JSON matching this schema:
{
  "reply": "your message here",
  "severity_level": "minor" | "critical"
}
"""

def get_chat_response(message: str) -> dict:
    try:
        prompt = f"{SYSTEM_PROMPT}\n\nUser Message: {message}"
        # Set generation config to strictly return JSON if possible, but handle manually if not
        response = model.generate_content(
            prompt,
            generation_config=os.environ.get('GEN_CONFIG', genai.types.GenerationConfig(temperature=0.7))
        )
        raw = response.text.strip()
        
        # Strip markdown fences if present
        if raw.startswith("```json"):
            raw = raw.replace("```json", "").replace("```", "").strip()
        elif raw.startswith("```"):
            raw = raw.replace("```", "").strip()
            
        print(f"Chatbot Engine Raw Response: {raw}")
        return json.loads(raw)
        
    except json.JSONDecodeError as e:
        print(f"Chatbot Engine JSON Error: {e} - Raw: {raw}")
        # If the model didn't return JSON, wrap its raw output in our schema
        return {
            "reply": raw if raw else "I'm having trouble analyzing this right now. If this is an emergency, please trigger the Emergency protocol.",
            "severity_level": "minor" # Default to minor if parser fails but text is generated
        }
    except Exception as e:
        print(f"Chatbot Engine API Error: {e}")
        return {
            "reply": "System Error: Unable to process request. If this is an emergency, please use the Emergency button.",
            "severity_level": "critical"
        }
