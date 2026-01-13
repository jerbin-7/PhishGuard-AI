
import React from 'react';
import { Mail, MessageSquare, Monitor, QrCode, Mic, ShieldAlert, ChevronRight } from 'lucide-react';
import { DetectorType } from '../types';

interface DashboardProps {
  onSelect: (type: DetectorType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelect }) => {
  const features = [
    {
      type: DetectorType.EMAIL,
      title: 'Email Detector',
      description: 'Analyze headers, content, and links for phishing signatures.',
      icon: Mail,
      color: 'bg-blue-500',
      tag: 'Text Analysis'
    },
    {
      type: DetectorType.SMS,
      title: 'SMS Phishing',
      description: 'Detect smishing attempts and fraudulent verification codes.',
      icon: MessageSquare,
      color: 'bg-emerald-500',
      tag: 'Short Message'
    },
    {
      type: DetectorType.SCREENSHOT,
      title: 'Screenshot Scan',
      description: 'Vision-based detection for fake login pages and UI spoofs.',
      icon: Monitor,
      color: 'bg-indigo-500',
      tag: 'Vision AI'
    },
    {
      type: DetectorType.QR_CODE,
      title: 'QR Code Guard',
      description: 'Audit QR URLs and destinations before you scan them.',
      icon: QrCode,
      color: 'bg-amber-500',
      tag: 'URL Safety'
    },
    {
      type: DetectorType.VOICE,
      title: 'Voice Deepfake',
      description: 'Identify AI-generated audio and voice impersonation attacks.',
      icon: Mic,
      color: 'bg-rose-500',
      tag: 'Audio Modal'
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Threat Detection Suite</h2>
        <p className="text-slate-400 max-w-2xl text-lg">
          Select a tool below to begin an AI-assisted analysis of suspicious communications or media. 
          Powered by Gemini's multi-modal understanding.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <button
            key={feature.type}
            onClick={() => onSelect(feature.type)}
            className="group relative flex flex-col p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
               <feature.icon size={80} />
            </div>
            
            <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-black/20`}>
              <feature.icon className="text-white" size={24} />
            </div>

            <div className="mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full">
                {feature.tag}
              </span>
            </div>

            <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed flex-1">
              {feature.description}
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-white">
              Launch Scanner
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}

        {/* Pro Tip Card */}
        <div className="md:col-span-2 lg:col-span-1 p-6 bg-indigo-600 rounded-2xl flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-20">
            <ShieldAlert size={140} />
          </div>
          <h3 className="text-xl font-bold mb-2">Did you know?</h3>
          <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
            Most phishing attacks occur via SMS (Smishing) nowadays due to higher open rates. Always verify links using PhishGuard.
          </p>
          <div className="text-xs font-mono bg-white/10 p-2 rounded self-start">
            PRO_MODE_ACTIVE
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
