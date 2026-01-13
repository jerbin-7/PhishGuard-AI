
import React, { useState } from 'react';
import { QrCode, Upload, Loader2, AlertCircle, Link } from 'lucide-react';
import { analyzeThreat } from '../services/geminiService';
import { DetectorType, DetectionState } from '../types';
import AnalysisResultDisplay from './AnalysisResultDisplay';

const QRDetector: React.FC = () => {
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
      const res = await analyzeThreat(DetectorType.QR_CODE, fileData);
      setState({ ...state, isAnalyzing: false, result: res });
    } catch (err: any) {
      setState({ ...state, isAnalyzing: false, error: err.message });
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <QrCode className="text-amber-400" size={28} />
          <h2 className="text-3xl font-bold">QR Code Guard</h2>
        </div>
        <p className="text-slate-400">Scan suspicious QR codes (Quishing) before visiting them. Useful for parking meters, flyers, or public Wi-Fi tags.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="max-w-md mx-auto">
          {preview ? (
            <div className="space-y-6">
              <div className="relative group aspect-square max-w-[300px] mx-auto overflow-hidden rounded-2xl border-4 border-slate-800">
                <img src={preview} alt="QR preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => {setPreview(null); setFileData(null); setState(s => ({...s, result: null}))}}
                  className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">Replace Image</span>
                </button>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={state.isAnalyzing}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-xl font-bold transition-all text-white shadow-xl shadow-amber-600/10"
              >
                {state.isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Decoding & Vetting URL...
                  </>
                ) : (
                  <>
                    <Link size={20} />
                    Audit QR Code
                  </>
                )}
              </button>
            </div>
          ) : (
            <label className="w-full aspect-square flex flex-col items-center justify-center gap-4 cursor-pointer p-8 border-2 border-dashed border-slate-700 hover:border-amber-500/50 hover:bg-slate-800/30 rounded-2xl transition-all group">
              <div className="p-4 bg-slate-800 rounded-full text-slate-400 group-hover:text-amber-400 group-hover:bg-amber-400/10 transition-colors">
                <QrCode size={48} />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-slate-300">Upload QR Image</p>
                <p className="text-sm text-slate-500">Supports PNG, JPG, WebP</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          )}
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

export default QRDetector;
