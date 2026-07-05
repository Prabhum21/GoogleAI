"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle, MapPin, AlertCircle, FileWarning } from "lucide-react";
import { useRegion } from "@/context/RegionContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type Report = {
  id: string;
  type: string;
  location: string;
  status: string;
  priority: string;
  date: string;
  region?: string;
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { region } = useRegion();
  const [newReport, setNewReport] = useState({ type: "Road Damage", location: "", description: "", priority: "Medium" });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/reports`, { params: { region } });
      setReports(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [region]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/reports`, newReport, { params: { region } });
      setShowModal(false);
      setNewReport({ type: "Road Damage", location: "", description: "", priority: "Medium" });
      fetchReports();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Community Reports</h1>
          <p className="text-slate-500">View and submit infrastructural and emergency reports.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium flex items-center transition"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          New Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <div>Loading...</div> : reports.map((r, i) => (
          <div key={i} className="glass-card p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className={`absolute top-0 left-0 w-1 h-full ${r.priority === 'High' ? 'bg-red-500' : r.priority === 'Medium' ? 'bg-orange-500' : 'bg-green-500'}`} />
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg">{r.type}</h3>
              <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full font-medium">
                {r.id}
              </span>
            </div>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
              <div className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> {r.location}</div>
              <div className="flex items-center"><AlertCircle className="h-4 w-4 mr-2" /> {r.priority} Priority</div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500">{r.date}</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-md ${r.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {r.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Submit New Report</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-700">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Issue Type</label>
                <select 
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 bg-transparent"
                  value={newReport.type}
                  onChange={e => setNewReport({...newReport, type: e.target.value})}
                >
                  <option>Road Damage</option>
                  <option>Water Leakage</option>
                  <option>Power Outage</option>
                  <option>Garbage Collection</option>
                  <option>Broken Signal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input 
                  type="text" required
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 bg-transparent"
                  placeholder="e.g. 5th Avenue & Main St"
                  value={newReport.location}
                  onChange={e => setNewReport({...newReport, location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 bg-transparent"
                  rows={3}
                  value={newReport.description}
                  onChange={e => setNewReport({...newReport, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select 
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2 bg-transparent"
                  value={newReport.priority}
                  onChange={e => setNewReport({...newReport, priority: e.target.value})}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white rounded-lg p-3 font-semibold hover:bg-blue-700 transition">
                Submit Report
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
