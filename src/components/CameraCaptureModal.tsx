import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Upload, X } from 'lucide-react';

interface CameraCaptureModalProps {
  onCapture: (imageBase64: string) => void;
  onClose: () => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  onCapture,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } },
          audio: false,
        });
        activeStream = s;
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err: any) {
        console.warn('Camera access denied or unavailable:', err);
        setCameraError('Kameran kunde inte startas. Du kan ladda upp en bildfil istället.');
      }
    }

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleTakePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    // Stop tracks
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    onCapture(dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      onCapture(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#eee7db] flex flex-col items-center">
        {/* Top Header */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-[#f0ebd9] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-sm">
              📷
            </div>
            <h3 className="font-bold text-lg text-[#23201d]">Skanna lista med kameran</h3>
          </div>
          <button
            onClick={() => {
              if (stream) {
                stream.getTracks().forEach((t) => t.stop());
              }
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video or Fallback View */}
        <div className="w-full aspect-[4/3] bg-neutral-900 rounded-2xl overflow-hidden relative flex items-center justify-center border border-black/10">
          {cameraError ? (
            <div className="p-6 text-center text-white space-y-3">
              <Camera className="w-10 h-10 mx-auto text-neutral-400 stroke-1" />
              <p className="text-xs text-neutral-300">{cameraError}</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-xs cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Välj bild från enheten</span>
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Aiming border */}
              <div className="absolute inset-8 border-2 border-white/50 border-dashed rounded-xl pointer-events-none flex items-center justify-center">
                <span className="text-[11px] bg-black/50 text-white px-2.5 py-1 rounded-full font-medium">
                  Rikta mot din lista eller lapp
                </span>
              </div>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Action Controls */}
        <div className="w-full flex items-center justify-between gap-3 pt-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f4ede4] hover:bg-[#eae1d5] text-[#3d2417] text-xs font-semibold transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Ladda upp fil</span>
          </button>

          {!cameraError && (
            <button
              type="button"
              onClick={handleTakePhoto}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Ta foto & Läs in</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
