"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Send, Bot, User, BrainCircuit, AlertCircle, CheckCircle, Activity, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRegion } from "@/context/RegionContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type Message = {
  role: "user" | "ai";
  content: string;
  data?: any;
};

function AssistantContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { region } = useRegion();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: `Hello! I am CivicMind AI. I have access to real-time city data (weather, traffic, alerts) for ${region}. How can I help you make a decision today?`
    }
  ]);
  const [input, setInput] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAutoSent, setHasAutoSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialQuery && !hasAutoSent) {
      setHasAutoSent(true);
      // Auto-trigger send logic without requiring button click
      const sendInitial = async () => {
        setMessages(prev => [...prev, { role: "user", content: initialQuery }]);
        setIsLoading(true);
        try {
          const response = await axios.post(`${API_URL}/chat`, { message: initialQuery, region });
          setMessages(prev => [...prev, { 
            role: "ai", 
            content: response.data.summary,
            data: response.data
          }]);
        } catch (error) {
          console.error("AI Error:", error);
          setMessages(prev => [...prev, { role: "ai", content: "Sorry, I am having trouble connecting to the decision engine right now." }]);
        } finally {
          setIsLoading(false);
          setInput("");
        }
      };
      sendInitial();
    }
  }, [initialQuery, hasAutoSent, region]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, { message: userMsg, region });
      
      setMessages(prev => [...prev, { 
        role: "ai", 
        content: response.data.summary,
        data: response.data
      }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: "ai", content: "Sorry, I am having trouble connecting to the decision engine right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto glass-card overflow-hidden">
      <div className="border-b border-slate-200 dark:border-slate-800 p-4 bg-white/50 dark:bg-slate-900/50 flex items-center space-x-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <BrainCircuit className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-lg">CivicMind AI Assistant</h2>
          <p className="text-xs text-slate-500">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex space-x-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-800' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600'}`}>
                {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm'}`}>
                <p className="leading-relaxed">{msg.content}</p>
                
                {/* Structured Data Response */}
                {msg.data && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Confidence Score</span>
                      <span className="text-sm font-bold text-blue-600 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                        {msg.data.confidence_score}%
                      </span>
                    </div>

                    {msg.data.key_risks && msg.data.key_risks.length > 0 && (
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                        <h4 className="text-sm font-bold text-red-800 dark:text-red-400 flex items-center mb-2">
                          <AlertCircle className="h-4 w-4 mr-2" /> Key Risks
                        </h4>
                        <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                          {msg.data.key_risks.map((risk: string, i: number) => (
                            <li key={i} className="flex items-start">
                              <span className="mr-2">•</span> {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {msg.data.recommendations && msg.data.recommendations.length > 0 && (
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                        <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 flex items-center mb-2">
                          <CheckCircle className="h-4 w-4 mr-2" /> Recommendations
                        </h4>
                        <ul className="text-sm text-emerald-700 dark:text-emerald-300 space-y-1">
                          {msg.data.recommendations.map((rec: string, i: number) => (
                            <li key={i} className="flex items-start">
                              <span className="mr-2">•</span> {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {msg.data.action_plan && (
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center mb-1">
                          <Activity className="h-4 w-4 mr-2" /> Action Plan
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {msg.data.action_plan}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex space-x-3 max-w-[85%]">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center">
                <Bot className="h-5 w-5 animate-pulse" />
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center space-x-2">
                <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></span>
                <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
        <div className="flex space-x-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="E.g. Is it safe to drive to work today?"
            className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AssistantPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <AssistantContent />
    </Suspense>
  );
}
