
import React, { useState } from 'react';
import { Monitor, Upload, Loader2, AlertCircle, ImageIcon } from 'lucide-react';
import { analyzeThreat } from '../services/geminiService';
import { DetectorType, DetectionState } from '../types';
import AnalysisResultDisplay from './AnalysisResultDisplay';

const ScreenshotDetector: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileData, setFileData] = useState<{ data: string; mimeType: string } | null>(null);
  const [state, setState] = useState<DetectionState>({
    isAnalyzing: false,
    result: null,
    error: null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setPreview(reader.result as string);
        setFileData({ data: base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!fileData) return;
    
    setState({ ...state, isAnalyzing: true, error: null, result: null });
    try {
      const res = await analyzeThreat(DetectorType.SCREENSHOT, fileData);
      setState({ ...state, isAnalyzing: false, result: res });
    } catch (err: any) {
      setState({ ...state, isAnalyzing: false, error: err.message });
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Monitor className="text-indigo-400" size={28} />
          <h2 className="text-3xl font-bold">Screenshot Scan</h2>
        </div>
        <p className="text-slate-400">Upload a screenshot of a suspicious login page, app, or website. Our vision AI will look for visual inconsistencies.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center min-h-[300px]">
          {preview ? (
            <div className="relative w-full group">
              <img src={preview} alt="Upload preview" className="rounded-xl max-h-[400px] w-full object-contain bg-black/20" />
              <button 
                onClick={() => {setPreview(null); setFileData(null); setState(s => ({...s, result: null}))}}
                className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-colors"
              >
                Reset
              </button>
            </div>
          ) : (
            <label className="w-full flex flex-col items-center justify-center gap-4 cursor-pointer p-12 border-2 border-dashed border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/30 rounded-2xl transition-all group">
              <div className="p-4 bg-slate-800 rounded-full text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-400/10 transition-colors">
                <Upload size={32} />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-slate-300">Drop screenshot here</p>
                <p className="text-sm text-slate-500">or click to browse files</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <ImageIcon size={18} className="text-indigo-400" />
              Vision Capabilities
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                URL spoofing detection (detecting text/UI vs actual logic)
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                Branding inconsistency (wrong logo variants, fonts)
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                Detection of high-pressure visual elements
              </li>
            </ul>
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={state.isAnalyzing || !fileData}
            className="mt-6 w-full flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-xl font-bold transition-all text-white shadow-xl shadow-indigo-600/10"
          >
            {state.isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Running Computer Vision Analysis...
              </>
            ) : (
              <>
                <Monitor size={20} />
                Analyze Screenshot
              </>
            )}
          </button>
        </div>
      </div>

      {state.error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
          <AlertCircle size={20} />
          {state.error}
        </div>
      )}

      {state.result && <AnalysisResultDisplay result={state.result} />}
    </div>
  );
};

export default ScreenshotDetector;
