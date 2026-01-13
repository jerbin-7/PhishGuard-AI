
import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Mail, 
  MessageSquare, 
  Monitor, 
  QrCode, 
  Mic, 
  LayoutDashboard,
  Menu,
  X,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { DetectorType } from './types';
import Dashboard from './components/Dashboard';
import EmailDetector from './components/EmailDetector';
import SMSDetector from './components/SMSDetector';
import ScreenshotDetector from './components/ScreenshotDetector';
import QRDetector from './components/QRDetector';
import VoiceDetector from './components/VoiceDetector';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DetectorType | 'DASHBOARD'>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { id: 'DASHBOARD', name: 'Dashboard', icon: LayoutDashboard },
    { id: DetectorType.EMAIL, name: 'Email Scanner', icon: Mail },
    { id: DetectorType.SMS, name: 'SMS Smishing', icon: MessageSquare },
    { id: DetectorType.SCREENSHOT, name: 'Screenshot Scan', icon: Monitor },
    { id: DetectorType.QR_CODE, name: 'QR Code Guard', icon: QrCode },
    { id: DetectorType.VOICE, name: 'Voice Deepfake', icon: Mic },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'DASHBOARD': return <Dashboard onSelect={setActiveTab} />;
      case DetectorType.EMAIL: return <EmailDetector />;
      case DetectorType.SMS: return <SMSDetector />;
      case DetectorType.SCREENSHOT: return <ScreenshotDetector />;
      case DetectorType.QR_CODE: return <QRDetector />;
      case DetectorType.VOICE: return <VoiceDetector />;
      default: return <Dashboard onSelect={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg lg:hidden"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:block
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="p-2 bg-indigo-600 rounded-xl">
              <ShieldAlert className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">PhishGuard <span className="text-indigo-400">AI</span></h1>
          </div>

          <nav className="flex-1 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                  ${activeTab === item.id 
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'}
                `}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <Zap size={14} className="text-amber-400" />
              Protection Status
            </div>
            <div className="flex items-center gap-2 text-sm text-green-400">
              <ShieldCheck size={16} />
              AI Engines Online
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
