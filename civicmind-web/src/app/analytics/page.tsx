"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

import { useRegion } from "@/context/RegionContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const { region } = useRegion();

  useEffect(() => {
    setData(null);
    axios.get(`${API_URL}/analytics`, { params: { region } }).then(res => setData(res.data));
  }, [region]);

  if (!data) return <div>Loading Analytics...</div>;

  const weatherData = {
    labels: data.weather_trend.map((d: any) => d.day),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: data.weather_trend.map((d: any) => d.temp),
        borderColor: 'rgb(59, 130, 246)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const aqiData = {
    labels: data.aqi_trend.map((d: any) => d.day),
    datasets: [
      {
        label: 'AQI Index',
        data: data.aqi_trend.map((d: any) => d.aqi),
        borderColor: 'rgb(249, 115, 22)', // orange-500
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const incidentsData = {
    labels: data.incidents.map((d: any) => d.month),
    datasets: [
      {
        label: 'Community Reports',
        data: data.incidents.map((d: any) => d.count),
        backgroundColor: 'rgb(16, 185, 129)', // emerald-500
        borderRadius: 6,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Analytics</h1>
        <p className="text-slate-500">Historical trends and predictions for the community.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 h-96">
          <h2 className="text-xl font-bold mb-4">Temperature Trend</h2>
          <div className="h-72">
            <Line options={options} data={weatherData} />
          </div>
        </div>

        <div className="glass-card p-6 h-96">
          <h2 className="text-xl font-bold mb-4">Air Quality Index (AQI)</h2>
          <div className="h-72">
            <Line options={options} data={aqiData} />
          </div>
        </div>

        <div className="glass-card p-6 h-96 lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Monthly Community Reports</h2>
          <div className="h-72">
            <Bar options={options} data={incidentsData} />
          </div>
        </div>
      </div>
    </div>
  );
}
