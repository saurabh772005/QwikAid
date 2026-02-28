import os
import google.generativeai as genai

API_KEY = os.environ.get("GOOGLE_API_KEY")
if not API_KEY or API_KEY.strip() == "":
    API_KEY = "AIzaSyDbw8Lc53-s3DMPgXVx5JWLuwy6rexLMXY"

print(f"Using API Key: {API_KEY[:5]}...{API_KEY[-5:]}")

try:
    genai.configure(api_key=API_KEY)
    # Testing both common model names
    model_name = 'gemini-1.5-flash'
    print(f"Testing model: {model_name}")
    model = genai.GenerativeModel(model_name)
    response = model.generate_content("Hello, this is a test.")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error with {model_name}: {e}")
    
    try:
        model_name = 'gemini-pro'
        print(f"Testing fallback model: {model_name}")
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Hello, this is a test.")
        print(f"Response: {response.text}")
    except Exception as e2:
        print(f"Error with {model_name}: {e2}")
