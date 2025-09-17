import { useState, useRef, useCallback } from "react";
import { Camera, CameraOff, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface CameraCaptureProps {
  onImageCapture: (imageData: string) => void;
}

const CameraCapture = ({ onImageCapture }: CameraCaptureProps) => {
  const [isActive, setIsActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera on mobile
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
        toast.success("Camera started successfully!");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Failed to access camera. Please check permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
  }, []);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas dimensions to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Get image data
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    onImageCapture(imageData);
    
    // Stop camera after capture
    stopCamera();
    toast.success("Image captured successfully!");
  }, [onImageCapture, stopCamera]);

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <div className="space-y-4">
      {!capturedImage ? (
        <div className="bg-gradient-card rounded-xl p-4 border border-border/50">
          {!isActive ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-secondary-dark" />
              </div>
              <p className="text-lg font-medium text-card-foreground mb-2">
                Camera Capture
              </p>
              <p className="text-muted-foreground mb-6">
                Use your device camera to capture compound characters
              </p>
              <button
                onClick={startCamera}
                className="bg-gradient-teal text-primary-foreground px-6 py-3 rounded-lg font-medium hover:shadow-medium transition-all duration-300"
              >
                Start Camera
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={captureImage}
                  className="bg-gradient-saffron text-primary-foreground px-6 py-3 rounded-lg font-medium hover:shadow-medium transition-all duration-300 flex items-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Capture
                </button>
                <button
                  onClick={stopCamera}
                  className="bg-muted text-muted-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted/80 transition-all duration-300 flex items-center gap-2"
                >
                  <CameraOff className="w-5 h-5" />
                  Stop
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gradient-card rounded-xl p-4 border border-border/50">
          <div className="space-y-4">
            <img
              src={capturedImage}
              alt="Captured character"
              className="w-full max-h-64 object-contain rounded-lg"
            />
            <div className="flex justify-center">
              <button
                onClick={retakePhoto}
                className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:shadow-medium transition-all duration-300 flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Retake Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;