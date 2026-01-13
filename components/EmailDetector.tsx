
import React, { useState } from 'react';
import { Mail, Search, Loader2, AlertCircle } from 'lucide-react';
import { analyzeThreat } from '../services/geminiService';
import { DetectorType, DetectionState } from '../types';
import AnalysisResultDisplay from './AnalysisResultDisplay';

const EmailDetector: React.FC = () => {
  const [emailText, setEmailText] = useState('');
  const [state, setState] = useState<DetectionState>({
    isAnalyzing: false,
    result: null,
    error: null
  });

  const handleAnalyze = async () => {
    if (!emailText.trim()) return;
    
    setState({ ...state, isAnalyzing: true, error: null, result: null });
    try {
      const res = await analyzeThreat(DetectorType.EMAIL, emailText);
      setState({ ...state, isAnalyzing: false, result: res });
    } catch (err: any) {
      setState({ ...state, isAnalyzing: false, error: err.message });
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Mail className="text-indigo-400" size={28} />
          <h2 className="text-3xl font-bold">Email Scanner</h2>
        </div>
        <p className="text-slate-400">Paste the email content (including subject and sender if possible) to identify phishing signatures.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <label className="block text-sm font-medium text-slate-400 mb-2">Email Content</label>
        <textarea
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
          placeholder="From: Security <noreply@fake-paypal.com>&#10;Subject: Account Suspended!&#10;&#10;Dear user, your account has been compromised. Please login at..."
          className="w-full h-48 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors font-mono text-sm resize-none"
        />

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 italic">
            Include full headers if you have them for better accuracy.
          </p>
          <button
            onClick={handleAnalyze}
            disabled={state.isAnalyzing || !emailText.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-xl font-bold transition-all"
          >
            {state.isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Analyzing Body & Headers...
              </>
            ) : (
              <>
                <Search size={20} />
                Deep Scan Email
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

export default EmailDetector;
