# CivicMind AI

CivicMind AI is a Decision Intelligence Platform for citizens and city administrators. It leverages AI (Google Gemini 2.0 Flash) to analyze civic data and provide actionable insights, alerts, and recommendations to users in real-time.

## 🌟 Key Features

* **AI-Powered Civic Chatbot:** Get instant summaries, risk assessments, and actionable recommendations based on real-time city data using Gemini 2.0.
* **Interactive Dashboard:** View city-wide alerts, analytics, and reports in an intuitive UI.
* **Citizen Reporting:** Easily report civic issues (e.g., infrastructure, safety, weather) with priority levels.
* **Live Maps & Analytics:** Integrated maps (Leaflet) and charts (Chart.js) to visualize data geographically.
* **Real-time Alerts:** Stay updated with the latest alerts for your specific region.
* **Mobile Responsive:** Fully responsive layout with a mobile-first design, ensuring a seamless experience on any device.

## 🛠️ Technology Stack

**Frontend (`civicmind-web`)**
* Next.js (React 19)
* Tailwind CSS & Radix UI (for styling and components)
* Framer Motion (for animations)
* Leaflet & React-Leaflet (for mapping)
* Chart.js (for analytics visualization)

**Backend (`civicmind-api`)**
* FastAPI (Python)
* Google GenAI SDK (Gemini 2.0 Flash)
* Uvicorn
* Pydantic (Data validation)

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Python (3.8+)
* Google Gemini API Key

### 1. Run the Backend API
```bash
cd civicmind-api
pip install -r requirements.txt

# Set up environment variables
# Create a .env file and add your GEMINI_API_KEY
# GEMINI_API_KEY=your_api_key_here

# Start the server
python main.py
```
*The API will run on http://localhost:8000*

### 2. Run the Frontend Web App
```bash
cd civicmind-web
npm install

# Start the development server
npm run dev
```
*The web app will run on http://localhost:3000*

## 📁 Project Structure

* `/civicmind-api`: Contains the FastAPI backend, mock data structures, and Gemini AI integration.
* `/civicmind-web`: Contains the Next.js frontend application, components, and UI assets.

## 🚢 Deployment

The project is configured for cloud deployment:

### Backend (GCP Cloud Run)
A `Dockerfile` is included in `civicmind-api` to containerize the FastAPI application.
```bash
cd civicmind-api
gcloud run deploy civicmind-api --source . --region us-central1 --allow-unauthenticated
```

### Frontend (Netlify)
The `civicmind-web` contains a `netlify.toml` for standard Next.js deployment.
```bash
cd civicmind-web
# Set the NEXT_PUBLIC_API_URL environment variable to your GCP URL
netlify deploy --prod
```
