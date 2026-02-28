import requests
import json

API_KEY = "AIzaSyDbw8Lc53-s3DMPgXVx5JWLuwy6rexLMXY"
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}"

try:
    response = requests.get(url)
    print("Status Code:", response.status_code)
    print("Response:", response.text)
except Exception as e:
    print("Error:", e)
