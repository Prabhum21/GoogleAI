from typing import List, Dict, Any

# Mock data for CivicMind AI Prototype supporting multiple regions

REGIONS_DATA = {
    "India": {
        "weather": {"temperature": 34, "condition": "Monsoon Rain", "humidity": 88, "rain_probability": 95, "wind_speed": 18},
        "traffic": {"status": "Severe Congestion", "congestion_level": 90, "affected_routes": ["NH48", "Outer Ring Road"], "estimated_delay_mins": 55},
        "aqi": {"index": 165, "status": "Unhealthy", "primary_pollutant": "PM2.5"},
        "decision_score": 58,
        "community_health": "Fair",
        "risk_level": "Elevated",
    },
    "United States": {
        "weather": {"temperature": 25, "condition": "Cloudy", "humidity": 60, "rain_probability": 20, "wind_speed": 15},
        "traffic": {"status": "Light Traffic", "congestion_level": 30, "affected_routes": [], "estimated_delay_mins": 5},
        "aqi": {"index": 45, "status": "Good", "primary_pollutant": "O3"},
        "decision_score": 92,
        "community_health": "Excellent",
        "risk_level": "Low",
    },
    "United Kingdom": {
        "weather": {"temperature": 15, "condition": "Light Rain", "humidity": 80, "rain_probability": 70, "wind_speed": 22},
        "traffic": {"status": "Moderate Traffic", "congestion_level": 60, "affected_routes": ["M25", "A4"], "estimated_delay_mins": 25},
        "aqi": {"index": 35, "status": "Good", "primary_pollutant": "NO2"},
        "decision_score": 75,
        "community_health": "Good",
        "risk_level": "Moderate",
    }
}

MOCK_HOSPITALS = [
    {"name": "General Hospital", "beds_available": 12, "distance_km": 2.5, "wait_time_mins": 45, "lat": 34.0522, "lng": -118.2437},
    {"name": "Metro Health Medical Center", "beds_available": 0, "distance_km": 4.1, "wait_time_mins": 120, "lat": 34.0622, "lng": -118.2537},
    {"name": "Community Care Clinic", "beds_available": 5, "distance_km": 1.8, "wait_time_mins": 15, "lat": 34.0422, "lng": -118.2337}
]

MOCK_ALERTS = [
    {"id": 1, "type": "Flood Warning", "severity": "High", "message": "Heavy monsoon rains leading to waterlogging in coastal areas.", "timestamp": "2026-07-05T14:30:00Z", "region": "India"},
    {"id": 2, "type": "Traffic", "severity": "Medium", "message": "Accident on Interstate 10 blocking two right lanes.", "timestamp": "2026-07-05T15:00:00Z", "region": "United States"},
    {"id": 3, "type": "Weather Alert", "severity": "Medium", "message": "High winds expected on the M25 bridge.", "timestamp": "2026-07-05T08:00:00Z", "region": "United Kingdom"}
]

MOCK_REPORTS = [
    {"id": "RPT-001", "type": "Water Leakage", "location": "Connaught Place", "status": "In Progress", "priority": "Medium", "date": "2026-07-04", "region": "India"},
    {"id": "RPT-002", "type": "Power Outage", "location": "Midtown Manhattan", "status": "Resolved", "priority": "High", "date": "2026-07-03", "region": "United States"},
    {"id": "RPT-003", "type": "Road Damage", "location": "Camden Town", "status": "Reported", "priority": "Low", "date": "2026-07-05", "region": "United Kingdom"}
]

MOCK_ANALYTICS = {
    "weather_trend": [
        {"day": "Mon", "temp": 26},
        {"day": "Tue", "temp": 28},
        {"day": "Wed", "temp": 27},
        {"day": "Thu", "temp": 22},
        {"day": "Fri", "temp": 24},
        {"day": "Sat", "temp": 29},
        {"day": "Sun", "temp": 30}
    ],
    "aqi_trend": [
        {"day": "Mon", "aqi": 80},
        {"day": "Tue", "aqi": 95},
        {"day": "Wed", "aqi": 110},
        {"day": "Thu", "aqi": 120},
        {"day": "Fri", "aqi": 85},
        {"day": "Sat", "aqi": 70},
        {"day": "Sun", "aqi": 65}
    ],
    "incidents": [
        {"month": "Jan", "count": 45},
        {"month": "Feb", "count": 52},
        {"month": "Mar", "count": 38},
        {"month": "Apr", "count": 65},
        {"month": "May", "count": 48},
        {"month": "Jun", "count": 70}
    ]
}

def get_region_data(region: str) -> Dict[str, Any]:
    return REGIONS_DATA.get(region, REGIONS_DATA["India"])

def get_alerts_by_region(region: str) -> List[Dict[str, Any]]:
    return [a for a in MOCK_ALERTS if a.get("region") == region or region == "All"]

def get_reports_by_region(region: str) -> List[Dict[str, Any]]:
    return [r for r in MOCK_REPORTS if r.get("region") == region or region == "All"]

def get_dashboard_summary(region: str):
    data = get_region_data(region)
    alerts = get_alerts_by_region(region)
    return {
        "weather": data["weather"],
        "traffic": data["traffic"],
        "aqi": data["aqi"],
        "decision_score": data["decision_score"],
        "community_health": data["community_health"],
        "risk_level": data["risk_level"],
        "alerts_count": len(alerts),
        "available_hospital_beds": sum(h["beds_available"] for h in MOCK_HOSPITALS)
    }

def get_context_for_ai(region: str) -> str:
    """Returns a string representation of current city state for AI prompt."""
    data = get_region_data(region)
    alerts = get_alerts_by_region(region)
    
    context = f"Region (Country): {region}. "
    context += f"Current Weather: {data['weather']['condition']}, {data['weather']['temperature']}°C. "
    context += f"Traffic: {data['traffic']['status']}. "
    context += f"Air Quality: {data['aqi']['index']} ({data['aqi']['status']}). "
    context += f"Active Alerts: {[a['message'] for a in alerts]}. "
    context += f"Available Hospitals: {', '.join([f'{h['name']} ({h['beds_available']} beds)' for h in MOCK_HOSPITALS if h['beds_available'] > 0])}. "
    return context
