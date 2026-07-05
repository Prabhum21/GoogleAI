"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CloudRain, Thermometer, Wind, AlertTriangle, Car, Activity, Map, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRegion } from "@/context/RegionContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { region } = useRegion();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/dashboard`, { params: { region } });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [region]);

  if (loading) {
    return <div className="flex h-full items-center justify-center">Loading...</div>;
  }

  if (!data) return <div>Failed to load data.</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-slate-500">Real-time overview of city conditions.</p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full font-semibold flex items-center">
          <Activity className="h-4 w-4 mr-2" />
          Community Health: {data.community_health}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Decision Score" 
          value={`${data.decision_score}/100`} 
          icon={<CheckCircle2 className="h-6 w-6 text-green-500" />} 
          trend="Good conditions for travel" 
          color="border-green-500/20 bg-green-50 dark:bg-green-950/20"
        />
        <StatCard 
          title="Current Risk" 
          value={data.risk_level} 
          icon={<AlertTriangle className="h-6 w-6 text-orange-500" />} 
          trend={`${data.alerts_count} Active Alerts`}
          color="border-orange-500/20 bg-orange-50 dark:bg-orange-950/20"
        />
        <StatCard 
          title="Air Quality" 
          value={data.aqi.index.toString()} 
          icon={<Wind className="h-6 w-6 text-red-500" />} 
          trend={data.aqi.status}
          color="border-red-500/20 bg-red-50 dark:bg-red-950/20"
        />
        <StatCard 
          title="Hospitals" 
          value={`${data.available_hospital_beds} Beds`} 
          icon={<Activity className="h-6 w-6 text-blue-500" />} 
          trend="Available in proximity"
          color="border-blue-500/20 bg-blue-50 dark:bg-blue-950/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Weather Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <CloudRain className="h-5 w-5 mr-2 text-blue-500" />
              Weather Outlook
            </h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-5xl font-light mb-2">{data.weather.temperature}°C</div>
              <div className="text-xl text-slate-500">{data.weather.condition}</div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <CloudRain className="h-4 w-4 mr-2" />
                {data.weather.rain_probability}% Rain Prob
              </div>
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <Wind className="h-4 w-4 mr-2" />
                {data.weather.wind_speed} km/h Wind
              </div>
            </div>
          </div>
        </motion.div>

        {/* Traffic Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <Car className="h-5 w-5 mr-2 text-orange-500" />
              Traffic Conditions
            </h2>
          </div>
          <div className="mb-4">
            <div className="text-2xl font-semibold text-orange-600 dark:text-orange-400 mb-1">
              {data.traffic.status}
            </div>
            <div className="text-sm text-slate-500">
              Est. Delay: {data.traffic.estimated_delay_mins} mins
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Affected Routes:</p>
            <div className="flex flex-wrap gap-2">
              {data.traffic.affected_routes.map((route: string) => (
                <span key={route} className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs text-slate-600 dark:text-slate-300">
                  {route}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }: any) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className={`p-6 rounded-2xl border ${color} shadow-sm`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-slate-500 text-sm font-medium mb-1">{title}</div>
        <div className="text-3xl font-bold mb-2">{value}</div>
        <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {trend}
        </div>
      </div>
    </motion.div>
  )
}
