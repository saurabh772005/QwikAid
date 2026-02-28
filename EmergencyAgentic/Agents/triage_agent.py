import google.generativeai as genai
import os
import json
import re

API_KEY = "AIzaSyDbw8Lc53-s3DMPgXVx5JWLuwy6rexLMXY"

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-pro')


SYSTEM_PROMPT = """
You are a medical emergency triage agent.

Strict rules:
- Respond ONLY with valid JSON.
- No markdown, no code fences, no explanation.
- severity_score must be an integer from 1 to 10.
- severity_level must be exactly one of: Low, Moderate, Critical.
- confidence must be exactly one of: High, Medium, Low.

JSON format:
{
  "emergency_type": "",
  "severity_score": 0,
  "severity_level": "",
  "required_specialist": "",
  "confidence": ""
}
"""

def run_triage(user_input):
    try:
        prompt = f"{SYSTEM_PROMPT}\n\nUser Input: {user_input}"
        response = model.generate_content(prompt)

        raw = response.text.strip()

        if not raw:
            return {"error": "Empty response from LLM"}

        # Strip markdown fences if present
        raw = re.sub(r"```json|```", "", raw).strip()

        result = json.loads(raw)

        # Validate required fields
        required = ["emergency_type", "severity_score", "severity_level", "required_specialist"]
        for field in required:
            if field not in result:
                return {"error": f"Missing field in triage response: {field}", "raw": raw}

        return result

    except json.JSONDecodeError as e:
        return {"error": "Invalid JSON from LLM", "raw_output": raw}
    except Exception as e:
        return {"error": str(e)}