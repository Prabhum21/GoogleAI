"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { AlertTriangle, Bell, Clock } from "lucide-react";
import { useRegion } from "@/context/RegionContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { region } = useRegion();

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/alerts`, { params: { region } }).then(res => {
      setAlerts(res.data);
      setLoading(false);
    });
  }, [region]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Emergency Alerts</h1>
        <p className="text-slate-500">Real-time notifications and warnings from city officials.</p>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {alerts.map(alert => (
            <div key={alert.id} className="glass-card p-6 border-l-4 border-l-red-500">
              <div className="flex items-start">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full mr-4 text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-lg">{alert.type}</h3>
                    <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 px-2 py-1 rounded-md font-semibold">
                      {alert.severity} Severity
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-3">{alert.message}</p>
                  <div className="flex items-center text-xs text-slate-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="text-center p-12 glass-card">
              <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-500">No active alerts</h3>
              <p className="text-slate-400">Your city is currently safe.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
