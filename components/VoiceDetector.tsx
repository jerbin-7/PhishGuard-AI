
import React, { useState } from 'react';
import { Mic, Upload, Loader2, AlertCircle, Play, Pause, Waves } from 'lucide-react';
import { analyzeThreat } from '../services/geminiService';
import { DetectorType, DetectionState } from '../types';
import AnalysisResultDisplay from './AnalysisResultDisplay';

const VoiceDetector: React.FC = () => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fileData, setFileData] = useState<{ data: string; mimeType: string } | null>(null);
  const [state, setState] = useState<DetectionState>({
    isAnalyzing: false,
    result: null,
    error: null
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setAudioUrl(URL.createObjectURL(file));
        setFileData({ data: base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAnalyze = async () => {
    if (!fileData) return;
    
    setState({ ...state, isAnalyzing: true, error: null, result: null });
    try {
      const res = await analyzeThreat(DetectorType.VOICE, fileData);
      setState({ ...state, isAnalyzing: false, result: res });
    } catch (err: any) {
      setState({ ...state, isAnalyzing: false, error: err.message });
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Mic className="text-rose-400" size={28} />
          <h2 className="text-3xl font-bold">Voice Deepfake Detector</h2>
        </div>
        <p className="text-slate-400">Analyze audio recordings to identify AI-generated voices or frequency artifacts associated with deepfake technology.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="max-w-2xl mx-auto">
          {audioUrl ? (
            <div className="space-y-8">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center gap-4">
                <div className="flex items-center justify-center w-full h-24 bg-rose-500/5 rounded-xl border border-rose-500/10 overflow-hidden relative">
                   {/* Decorative waveform */}
                   <div className="flex items-end gap-1 h-12 opacity-30">
                     {[...Array(20)].map((_, i) => (
                       <div key={i} className={`w-1 bg-rose-500 rounded-full animate-bounce`} style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
                     ))}
                   </div>
                </div>

                <div className="flex items-center gap-4 w-full">
                  <button 
                    onClick={togglePlay}
                    className="p-4 bg-rose-600 hover:bg-rose-500 rounded-full text-white transition-all shadow-lg shadow-rose-600/20"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-300">Recording_Analyzable.mp3</p>
                    <p className="text-xs text-slate-500">Ready for acoustic footprint scan</p>
                  </div>
                  <button 
                    onClick={() => {setAudioUrl(null); setFileData(null); setState(s => ({...s, result: null}))}}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Clear Audio
                  </button>
                </div>
                <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={state.isAnalyzing}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-xl font-bold transition-all text-white shadow-xl shadow-rose-600/10"
              >
                {state.isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Scanning Acoustic Fingerprint...
                  </>
                ) : (
                  <>
                    <Waves size={20} />
                    Deep Audit Audio
                  </>
                )}
              </button>
            </div>
          ) : (
            <label className="w-full py-16 flex flex-col items-center justify-center gap-4 cursor-pointer border-2 border-dashed border-slate-700 hover:border-rose-500/50 hover:bg-slate-800/30 rounded-2xl transition-all group">
              <div className="p-5 bg-slate-800 rounded-full text-slate-400 group-hover:text-rose-400 group-hover:bg-rose-400/10 transition-colors">
                <Mic size={48} />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-slate-300">Drop audio file here</p>
                <p className="text-sm text-slate-500">Supports MP3, WAV, M4A, OGG</p>
              </div>
              <input type="file" accept="audio/*" className="hidden" onChange={handleFileChange} />
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

export default VoiceDetector;
