'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, RefreshCw, Sparkles, Target, Zap 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface AnalysisWorkflowProps {
  isAnalyzing: boolean;
  currentStep: number;
  progress: number;
  steps: any[];
  capturedImage: string | null;
}

export function AnalysisWorkflow({ 
  isAnalyzing, 
  currentStep, 
  progress, 
  steps, 
  capturedImage 
}: AnalysisWorkflowProps) {
  if (!isAnalyzing) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-zinc-950 border border-white/5 p-12 space-y-12 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-primary shadow-[0_0_20px_rgba(251,191,36,0.5)]"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-square bg-zinc-900 border border-white/10 overflow-hidden group">
          {capturedImage && (
            <img 
              src={capturedImage} 
              className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700" 
              alt="Scan Target"
            />
          )}
          <div className="absolute inset-0 scanline" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Target className="h-24 w-24 text-primary opacity-20 animate-ping" />
          </div>
          
          <div className="absolute bottom-6 left-6 space-y-2">
            <p className="text-[10px] font-mono text-primary uppercase tracking-widest animate-pulse">Scanning_Landmarks...</p>
            <div className="flex gap-1">
               {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-4 h-1 bg-primary/20" />)}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <Badge className="bg-primary/20 text-primary border-primary/30 uppercase rounded-none text-[8px] tracking-[0.3em] font-black mb-4">Neural_Synthesis_Active</Badge>
            <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white leading-none">
              Analyzing<span className="text-primary">_Protocol</span>
            </h2>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-6 p-4 border transition-all duration-500 ${
                  index === currentStep 
                    ? 'bg-primary/10 border-primary/40' 
                    : index < currentStep 
                    ? 'bg-zinc-900/50 border-white/5 opacity-50' 
                    : 'border-transparent opacity-20'
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-white/10">
                  {index < currentStep ? (
                    <Check className="h-5 w-5 text-primary" />
                  ) : index === currentStep ? (
                    <RefreshCw className="h-5 w-5 text-primary animate-spin" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white">{step.name}</p>
                  <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">{step.status}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5">
             <div className="flex justify-between items-center mb-4 text-[10px] font-mono uppercase tracking-widest">
                <span className="text-zinc-500">Synthesis_Progress</span>
                <span className="text-primary font-black">{Math.floor(progress)}%</span>
             </div>
             <Progress value={progress} className="h-1 bg-white/5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
