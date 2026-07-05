"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Search, Bell, Moon, Sun, User, Menu, X } from "lucide-react";
import { useRegion } from "@/context/RegionContext";
import { navItems } from "./Sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { region, setRegion, regions } = useRegion();

  useEffect(() => {
    // Check initial theme
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Hide header on landing page
  if (pathname === "/") return null;

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <>
      <header className="h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
        <div className="flex items-center flex-1 max-w-xl">
          <button 
            className="mr-3 md:hidden p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        <form 
          className="relative w-full"
          onSubmit={(e) => {
            e.preventDefault();
            const target = e.currentTarget.elements.namedItem('search') as HTMLInputElement;
            if (target.value.trim()) {
              window.location.href = `/assistant?q=${encodeURIComponent(target.value)}`;
            }
          }}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            name="search"
            placeholder="Ask CivicMind AI or search..."
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400 transition-shadow"
          />
        </form>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="hidden md:block">
          <select 
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          >
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        
        <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        <div className="hidden sm:flex h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-green-400 items-center justify-center text-white cursor-pointer shadow-sm">
          <User className="h-4 w-4" />
        </div>
      </div>
    </header>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative flex flex-col w-72 max-w-[80%] h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto">
            <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
                CivicMind AI
              </span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2">
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
                    <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400")} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
