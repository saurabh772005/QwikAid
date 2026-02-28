from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key="AIzaSyDbw8Lc53-s3DMPgXVx5JWLuwy6rexLMXY"
)

response = llm.invoke("Say hello")
print(response.content)
