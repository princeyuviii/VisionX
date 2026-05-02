'use client';

import { motion } from 'framer-motion';
import { 
  Camera, Upload, Zap, Bot, Target, X, RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useRef, useState, useCallback } from 'react';

interface PhotoInputProps {
  onImageCapture: (image: string) => void;
  isAnalyzing: boolean;
  onStartAnalysis: () => void;
  consultationText: string;
  setConsultationText: (text: string) => void;
  onConsultation: () => void;
  isConsulting: boolean;
}

export function PhotoInput({ 
  onImageCapture, 
  isAnalyzing, 
  onStartAnalysis,
  consultationText,
  setConsultationText,
  onConsultation,
  isConsulting
}: PhotoInputProps) {
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsUsingCamera(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions or use the upload option.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsUsingCamera(false);
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL("image/jpeg");
        setCapturedImage(imageData);
        onImageCapture(imageData);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setCapturedImage(imageData);
        onImageCapture(imageData);
        setShowPhotoDialog(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Visual Diagnostic Hub */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="bg-zinc-950 border border-white/5 p-12 space-y-10 shadow-2xl relative group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
           <Target className="h-48 w-48 text-primary" />
        </div>
        
        <div className="space-y-4 relative">
          <Badge className="bg-primary/20 text-primary border-primary/30 uppercase rounded-none text-[8px] tracking-[0.3em] font-black">Input_Source_Ready</Badge>
          <h2 className="text-5xl font-black tracking-tighter uppercase italic text-white leading-none">
            Neural<span className="text-primary text-glow-amber">_Scan</span>
          </h2>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest max-w-md">
            Initialize visual synthesis by deploying your biometrics. Our ML cluster will analyze 128 skeletal landmarks for optimal fitment.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 relative">
          <Button 
            onClick={() => { setShowPhotoDialog(true); startCamera(); }}
            className="h-48 bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all flex flex-col gap-4 rounded-none uppercase font-black tracking-widest text-[10px] group/btn shadow-xl"
          >
            <Camera className="h-8 w-8 text-primary group-hover/btn:scale-110 transition-transform" />
            LIVE_INITIALIZATION
          </Button>
          
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="h-48 bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all flex flex-col gap-4 rounded-none uppercase font-black tracking-widest text-[10px] group/btn shadow-xl"
          >
            <Upload className="h-8 w-8 text-primary group-hover/btn:scale-110 transition-transform" />
            UPLINK_ARCHIVE
          </Button>
        </div>

        {capturedImage && (
           <div className="pt-8 border-t border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Awaiting_Protocol_Launch</p>
                    <p className="text-[8px] font-mono text-zinc-500 uppercase">Status: Image_Buffered_Successfully</p>
                 </div>
                 <Button 
                   onClick={onStartAnalysis} 
                   disabled={isAnalyzing}
                   className="bg-primary text-black hover:bg-white font-black py-6 px-12 rounded-none uppercase tracking-[0.4em] text-[10px] shadow-[0_0_30px_rgba(251,191,36,0.3)] animate-pulse"
                 >
                   {isAnalyzing ? 'SYNTHESIZING...' : 'INITIALIZE_SYNTHESIS'}
                 </Button>
              </div>
           </div>
        )}
      </motion.div>

      {/* Manual Override Hub */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="bg-zinc-950 border border-white/5 p-12 space-y-10 shadow-2xl relative"
      >
        <div className="space-y-4">
          <Badge className="bg-zinc-900 text-zinc-500 border-white/5 uppercase rounded-none text-[8px] tracking-[0.3em] font-black">Manual_Override</Badge>
          <h2 className="text-5xl font-black tracking-tighter uppercase italic text-white leading-none">
            Style<span className="text-zinc-600">_Consultant</span>
          </h2>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest max-w-md">
            Execute a manual stylistic query. Describe your aesthetic requirements for a targeted neural synthesis.
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative">
             <Textarea 
               value={consultationText}
               onChange={(e) => setConsultationText(e.target.value)}
               placeholder="INPUT_STYLE_REQUIREMENTS..."
               className="bg-zinc-900 border-white/5 text-white rounded-none min-h-[160px] font-mono text-[11px] uppercase tracking-widest p-6 focus:border-primary/50 transition-all"
             />
             <div className="absolute bottom-4 right-4 flex gap-2">
                <div className="w-1 h-1 bg-primary rounded-full animate-ping" />
                <span className="text-[8px] font-mono text-primary uppercase">Ready_For_Input</span>
             </div>
          </div>
          <Button 
            onClick={onConsultation}
            disabled={isConsulting || !consultationText}
            className="w-full bg-zinc-900 text-white hover:bg-white hover:text-black border border-white/10 font-black py-8 rounded-none uppercase tracking-[0.4em] text-[10px] transition-all"
          >
            {isConsulting ? (
               <> <RefreshCw className="mr-3 h-4 w-4 animate-spin" /> SYNCHRONIZING_DATA... </>
            ) : (
               <> <Bot className="mr-3 h-4 w-4" /> EXECUTE_CONSULTATION </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Hidden inputs/canvases */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Dialog */}
      <Dialog open={showPhotoDialog} onOpenChange={(open) => { if(!open) stopCamera(); setShowPhotoDialog(open); }}>
        <DialogContent className="bg-zinc-950 border-white/5 rounded-none max-w-3xl p-0 overflow-hidden">
          <div className="bg-primary/10 border-b border-primary/20 p-6 flex justify-between items-center">
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                <Zap className="h-4 w-4" /> NEURAL_INPUT_BUFFER
             </h3>
             <div className="flex items-center gap-4">
                <div className="text-[8px] font-mono text-zinc-500 uppercase">Stream_Integrity: 98.4%</div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             </div>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="relative aspect-video bg-black border border-white/5 overflow-hidden group">
              {isUsingCamera ? (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale-50 group-hover:grayscale-0 transition-all" />
              ) : capturedImage ? (
                <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                   <RefreshCw className="h-12 w-12 text-primary animate-spin" />
                   <p className="text-[10px] font-mono text-primary uppercase tracking-widest">Initializing_Optical_Link...</p>
                </div>
              )}
              <div className="absolute inset-0 scanline pointer-events-none" />
              {isUsingCamera && <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-64 h-64 border border-primary/20 rounded-full animate-ping opacity-20" />
                 <Target className="h-32 w-32 text-primary/10" />
              </div>}
            </div>

            <div className="flex gap-6">
              {isUsingCamera ? (
                <Button 
                  onClick={takePhoto} 
                  className="flex-1 bg-primary text-black hover:bg-white font-black py-8 rounded-none uppercase tracking-[0.4em] text-[10px]"
                >
                  <Camera className="mr-3 h-4 w-4" /> CAPTURE_SIGNAL
                </Button>
              ) : (
                <Button 
                  onClick={() => { setCapturedImage(null); startCamera(); }} 
                  className="flex-1 bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black font-black py-8 rounded-none uppercase tracking-[0.4em] text-[10px]"
                >
                  <RefreshCw className="mr-3 h-4 w-4" /> RE_INITIALIZE_OPTICS
                </Button>
              )}
              <Button 
                onClick={() => { setShowPhotoDialog(false); stopCamera(); }} 
                className="px-12 bg-zinc-900 border border-white/5 text-zinc-600 hover:text-white font-black py-8 rounded-none uppercase tracking-[0.4em] text-[10px]"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
