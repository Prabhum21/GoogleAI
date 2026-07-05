"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquare, 
  BarChart3, 
  FileWarning, 
  BellRing, 
  Map as MapIcon, 
  UploadCloud, 
  Settings,
  BrainCircuit
} from "lucide-react";
import { cn } from "@/lib/utils";

export const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Assistant", href: "/assistant", icon: MessageSquare },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Reports", href: "/reports", icon: FileWarning },
  { name: "Alerts", href: "/alerts", icon: BellRing },
  { name: "Map", href: "/map", icon: MapIcon },
  { name: "Upload", href: "/admin", icon: UploadCloud },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  // Hide sidebar on landing page
  if (pathname === "/") return null;

  return (
    <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col">
      <div className="p-6 flex items-center space-x-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <BrainCircuit className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
          CivicMind AI
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer",
                isActive 
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Powered by</p>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Google Cloud</span>
          </div>
        </div>
      </div>
    </div>
  );
}
