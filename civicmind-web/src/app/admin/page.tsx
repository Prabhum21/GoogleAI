"use client";

import { useState } from "react";
import axios from "axios";
import { UploadCloud, CheckCircle2, File, AlertCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus("uploading");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_URL}/admin/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setStatus("success");
      setMessage(res.data.status);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Failed to upload data. Is the backend running?");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
        <p className="text-slate-500">Upload structured datasets to train the AI and update the dashboard.</p>
      </div>

      <div className="glass-card p-8 text-center border-dashed border-2 border-slate-300 dark:border-slate-700">
        <UploadCloud className="h-16 w-16 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Upload Data Pipeline (Mock)</h2>
        <p className="text-sm text-slate-500 mb-6">
          Simulate ingesting CSV or JSON data into Google Cloud Storage and BigQuery.
        </p>
        
        <input 
          type="file" 
          id="file-upload" 
          className="hidden" 
          accept=".csv,.json"
          onChange={handleFileChange}
        />
        
        {!file ? (
          <label htmlFor="file-upload" className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-medium transition inline-flex items-center">
            Select File
          </label>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg mb-4">
              <File className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">{file.name}</span>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setFile(null)}
                className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpload}
                disabled={status === "uploading"}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition disabled:opacity-50"
              >
                {status === "uploading" ? "Processing..." : "Ingest Data"}
              </button>
            </div>
          </div>
        )}
      </div>

      {status === "success" && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl flex items-start">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-3 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400">Success</h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">{message}</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 p-4 rounded-xl flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-800 dark:text-red-400">Error</h4>
            <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
