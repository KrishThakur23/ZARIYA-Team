
'use client';

import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Loader2, VideoOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  isProcessing: boolean;
  onCameraReady?: () => void;
}

export default function CameraCapture({ onCapture, isProcessing, onCameraReady }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let stream: MediaStream | null = null;

    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        setHasCameraPermission(false);
        return;
      }
      
      try {
        // Request camera access with audio disabled to prevent audio conflicts
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: false // Explicitly disable audio to prevent conflicts with voice assistant
        });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Ensure video is muted to prevent any audio interference
          videoRef.current.muted = true;
          
          // Add event listeners to ensure video loads properly
          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded, dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.volume = 0;
            }
          };
          
          videoRef.current.oncanplay = () => {
            console.log('Video can play, starting playback');
            videoRef.current?.play().catch(console.error);
          };
          
          // Force play after a short delay if video doesn't start automatically
          setTimeout(() => {
            if (videoRef.current && videoRef.current.paused) {
              console.log('Forcing video play after delay');
              videoRef.current.play().catch(console.error);
            }
          }, 500);
        }
        setIsInitialized(true);
        onCameraReady?.();
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    // Delay camera initialization to allow voice assistant to start first
    const initTimer = setTimeout(() => {
      getCameraPermission();
    }, 1000); // 1 second delay to let voice assistant establish audio context

    return () => {
      clearTimeout(initTimer);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCaptureClick = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        // Set canvas dimensions to match video to capture the frame correctly
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/png');
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full rounded-md border bg-muted flex items-center justify-center overflow-hidden">
        <video 
          ref={videoRef} 
          className="w-full h-full object-cover" 
          autoPlay 
          muted 
          playsInline 
          volume={0}
          onLoadedMetadata={() => {
            // Ensure video is muted when metadata loads
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.volume = 0;
              console.log('Video metadata loaded via onLoadedMetadata');
            }
          }}
          onError={(e) => {
            console.error('Video error:', e);
          }}
        />
        
        {!isInitialized && hasCameraPermission !== false && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {hasCameraPermission === false && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4">
            <VideoOff className="h-12 w-12 mb-4" />
            <Alert variant="destructive" className="bg-transparent border-0 text-center">
              <AlertTitle>Camera Access Denied</AlertTitle>
              <AlertDescription className="text-white/80">
                Please allow camera access. You can use the upload option instead.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {hasCameraPermission === null && (
            <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}
      </div>
      <Button 
        onClick={handleCaptureClick} 
        disabled={hasCameraPermission !== true || isProcessing} 
        className="w-full"
        aria-label="Capture Photo"
      >
        {isProcessing ? (
          <Loader2 className="mr-2 animate-spin" />
        ) : (
          <Camera className="mr-2" />
        )}
        {isProcessing ? 'Processing...' : 'Capture Photo'}
      </Button>
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}
