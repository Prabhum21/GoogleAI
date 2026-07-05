"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type RegionContextType = {
  region: string;
  setRegion: (region: string) => void;
  regions: string[];
};

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export const REGIONS = ["India", "United States", "United Kingdom"];

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = useState("India");

  useEffect(() => {
    const saved = localStorage.getItem("civicmind-region");
    if (saved && REGIONS.includes(saved)) {
      setRegionState(saved);
    }
  }, []);

  const setRegion = (newRegion: string) => {
    setRegionState(newRegion);
    localStorage.setItem("civicmind-region", newRegion);
  };

  return (
    <RegionContext.Provider value={{ region, setRegion, regions: REGIONS }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error("useRegion must be used within a RegionProvider");
  }
  return context;
}
