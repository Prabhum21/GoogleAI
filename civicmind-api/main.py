import os
import json
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
import mock_data
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="CivicMind AI API")

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For hackathon
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini Client if API key is present
API_KEY = os.environ.get("GEMINI_API_KEY")
client = None
if API_KEY:
    client = genai.Client(api_key=API_KEY)

class ChatRequest(BaseModel):
    message: str
    region: str = "India"

class ReportRequest(BaseModel):
    type: str
    location: str
    description: str
    priority: str

@app.get("/api/dashboard")
def get_dashboard(region: str = "India"):
    return mock_data.get_dashboard_summary(region)

@app.get("/api/alerts")
def get_alerts(region: str = "India"):
    return mock_data.get_alerts_by_region(region)

@app.get("/api/analytics")
def get_analytics(region: str = "India"):
    # Since mock analytics is global, we just return the same mock data for now
    # In a real app, this would filter by region
    return mock_data.MOCK_ANALYTICS

@app.get("/api/reports")
def get_reports(region: str = "India"):
    return mock_data.get_reports_by_region(region)

@app.post("/api/reports")
def create_report(report: ReportRequest, region: str = "India"):
    new_report = {
        "id": f"RPT-00{len(mock_data.MOCK_REPORTS) + 1}",
        "type": report.type,
        "location": report.location,
        "status": "Reported",
        "priority": report.priority,
        "date": "2026-07-05",
        "region": region
    }
    mock_data.MOCK_REPORTS.append(new_report)
    return {"status": "success", "report": new_report}

@app.get("/api/hospitals")
def get_hospitals(region: str = "India"):
    # Mock data is global, returning all hospitals for now
    return mock_data.MOCK_HOSPITALS

@app.post("/api/chat")
def chat_with_ai(request: ChatRequest):
    context = mock_data.get_context_for_ai(request.region)
    
    prompt = f"""
    You are CivicMind AI, a Decision Intelligence Platform for citizens.
    Current City State Context: {context}
    
    User Question: {request.message}
    
    Analyze all available structured data and the user's question.
    Generate a response strictly in JSON format with the following keys:
    - "summary": A short summary answering the question.
    - "key_risks": An array of strings describing potential risks (if any).
    - "recommendations": An array of strings with actionable advice.
    - "confidence_score": An integer from 0 to 100.
    - "action_plan": A short string describing the immediate next step.
    
    Ensure the output is pure JSON. Do not include markdown code blocks.
    """
    
    if client:
        try:
            response = client.models.generate_content(
                model='gemini-2.0-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                )
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"Gemini API Error: {e}")
            pass
            
    # Mock AI response if no key or error
    return {
        "summary": "Based on current data, there is heavy rain and severe traffic congestion in your area.",
        "key_risks": ["Flash floods in downtown area", "Delayed travel time due to accidents"],
        "recommendations": ["Avoid Highway 101", "Delay travel if possible", "Stay indoors if you are in the downtown area"],
        "confidence_score": 85,
        "action_plan": "Monitor weather alerts and delay non-essential travel."
    }

@app.post("/api/admin/upload")
async def upload_data(file: UploadFile = File(...)):
    # Simulate processing uploaded data (CSV/JSON to BigQuery)
    return {"filename": file.filename, "status": "Successfully ingested into BigQuery (Mock)"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
