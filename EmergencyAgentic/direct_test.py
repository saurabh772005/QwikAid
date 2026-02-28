import requests
import json
import os

API_KEY = "AIzaSyDbw8Lc53-s3DMPgXVx5JWLuwy6rexLMXY"
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={API_KEY}"

payload = {
    "contents": [{
        "parts": [{"text": "Say hello"}]
    }]
}
headers = {'Content-Type': 'application/json'}

try:
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    print("Status Code:", response.status_code)
    print("Response:", response.text)
except Exception as e:
    print("Error:", e)
