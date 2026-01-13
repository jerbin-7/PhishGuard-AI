
import React, { useState } from 'react';
import { MessageSquare, Search, Loader2, AlertCircle } from 'lucide-react';
import { analyzeThreat } from '../services/geminiService';
import { DetectorType, DetectionState } from '../types';
import AnalysisResultDisplay from './AnalysisResultDisplay';

const SMSDetector: React.FC = () => {
  const [smsText, setSmsText] = useState('');
  const [state, setState] = useState<DetectionState>({
    isAnalyzing: false,
    result: null,
    error: null
  });

  const handleAnalyze = async () => {
    if (!smsText.trim()) return;
    
    setState({ ...state, isAnalyzing: true, error: null, result: null });
    try {
      const res = await analyzeThreat(DetectorType.SMS, smsText);
      setState({ ...state, isAnalyzing: false, result: res });
    } catch (err: any) {
      setState({ ...state, isAnalyzing: false, error: err.message });
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="text-emerald-400" size={28} />
          <h2 className="text-3xl font-bold">SMS Phishing Scanner</h2>
        </div>
        <p className="text-slate-400">Paste suspicious text messages to check for smishing tactics and malicious links.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <label className="block text-sm font-medium text-slate-400 mb-2">SMS Message</label>
        <div className="relative">
          <textarea
            value={smsText}
            onChange={(e) => setSmsText(e.target.value)}
            placeholder="USPS: Your package is on hold. Please update address at: bit.ly/fake-link"
            className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-colors font-mono text-sm resize-none"
          />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-time link auditing active
          </div>
          <button
            onClick={handleAnalyze}
            disabled={state.isAnalyzing || !smsText.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-xl font-bold transition-all text-white shadow-lg shadow-emerald-600/10"
          >
            {state.isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Scanning SMS Content...
              </>
            ) : (
              <>
                <Search size={20} />
                Verify Message
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

export default SMSDetector;
