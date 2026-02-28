import os
import google.generativeai as genai
genai.configure(api_key="AIzaSyDbw8Lc53-s3DMPgXVx5JWLuwy6rexLMXY")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(m.name)
