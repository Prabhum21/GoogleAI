"use client";

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import axios from "axios";
import { Loader2 } from "lucide-react";

// Dynamically import map component with no SSR to prevent window is not defined error
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  ),
});

import { useRegion } from "@/context/RegionContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function MapPage() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const { region } = useRegion();

  useEffect(() => {
    axios.get(`${API_URL}/hospitals`, { params: { region } }).then(res => setHospitals(res.data));
  }, [region]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-10rem)] flex flex-col">
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight mb-2">City Map</h1>
        <p className="text-slate-500">Interactive view of critical infrastructure and incidents.</p>
      </div>

      <div className="flex-1 glass-card p-4 overflow-hidden rounded-2xl relative z-0">
        <MapComponent hospitals={hospitals} />
      </div>
    </div>
  );
}
