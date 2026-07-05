"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Cloud, Database, Shield, Zap } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-md">
            <BrainCircuit className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
            CivicMind AI
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="text-slate-600 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition">
            Platform
          </Link>
          <Link href="/dashboard" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition shadow-lg shadow-blue-500/30">
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto w-full mt-12 md:mt-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-8"
        >
          <Zap className="h-4 w-4" />
          <span>Powered by Gemini 2.5 Flash & Google Cloud</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
        >
          Decision Intelligence for <br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-green-500 to-emerald-500">
            Smarter Communities
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mb-12"
        >
          A unified AI assistant that understands weather, traffic, air quality, emergencies, and city services to recommend the best daily decisions for citizens.
        </motion.p>

        <motion.form 
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) {
              router.push(`/assistant?q=${encodeURIComponent(query)}`);
            } else {
              router.push(`/assistant`);
            }
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-2xl bg-white dark:bg-slate-900 p-2 pl-6 rounded-full shadow-xl shadow-blue-500/10 border border-slate-200 dark:border-slate-800 flex items-center mb-16"
        >
          <BrainCircuit className="h-6 w-6 text-blue-500 mr-3" />
          <input 
            type="text" 
            placeholder="Ask anything... e.g. 'Is it safe to travel today?'"
            className="flex-1 bg-transparent border-none outline-none text-lg text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition flex items-center group">
            Ask AI
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.form>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 w-full mt-12 mb-24 text-left">
          <FeatureCard 
            icon={<Cloud className="h-6 w-6 text-blue-500" />}
            title="Google Cloud Architecture"
            desc="Built on highly scalable Google Cloud Run, Cloud Storage, and BigQuery."
          />
          <FeatureCard 
            icon={<BrainCircuit className="h-6 w-6 text-green-500" />}
            title="Gemini AI Reasoning"
            desc="Advanced decision generation using Gemini 2.5 Flash for rapid insight."
          />
          <FeatureCard 
            icon={<Database className="h-6 w-6 text-orange-500" />}
            title="Unified Data Pipelines"
            desc="Real-time aggregation of diverse urban datasets into a single dashboard."
          />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500 text-sm">
        <p>Google Cloud Hackathon Prototype • Built with Next.js & FastAPI</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="h-12 w-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400">{desc}</p>
    </div>
  )
}
