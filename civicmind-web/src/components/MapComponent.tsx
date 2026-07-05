"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

export default function MapComponent({ hospitals }: { hospitals: any[] }) {
  useEffect(() => {
    // Fix leaflet missing icons issue in Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  // Center of Los Angeles (Mock data location)
  const position: [number, number] = [34.0522, -118.2437];

  const [mapId] = useState(() => Math.random().toString(36).substring(7));

  return (
    <MapContainer key={mapId} center={position} zoom={13} scrollWheelZoom={true} className="w-full h-full rounded-xl z-0 relative">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {hospitals.map((h, i) => (
        <Marker key={i} position={[h.lat, h.lng]}>
          <Popup>
            <div className="font-sans">
              <h3 className="font-bold text-sm mb-1">{h.name}</h3>
              <p className="text-xs text-slate-600 mb-1">{h.beds_available} beds available</p>
              <p className="text-xs text-red-500 font-medium">{h.wait_time_mins} mins wait time</p>
            </div>
          </Popup>
        </Marker>
      ))}
      
      {/* City Center Marker */}
      <Marker position={position}>
        <Popup>
          City Center - CivicMind AI
        </Popup>
      </Marker>
    </MapContainer>
  );
}
