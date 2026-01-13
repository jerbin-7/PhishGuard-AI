
export enum DetectorType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  SCREENSHOT = 'SCREENSHOT',
  QR_CODE = 'QR_CODE',
  VOICE = 'VOICE'
}

export interface AnalysisResult {
  riskScore: number; // 0-100
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
  indicators: string[];
  recommendations: string[];
}

export interface DetectionState {
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
}
