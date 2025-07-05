"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, StopCircle, AlertCircle, Scan } from "lucide-react";
import jsQR from "jsqr";

interface QRCameraProps {
  onQRDetected: (data: string) => void;
  isScanning: boolean;
  onScanningChange: (scanning: boolean) => void;
}

interface QRScanResult {
  data: string;
  timestamp: Date;
}

export const QRCamera: React.FC<QRCameraProps> = ({
  onQRDetected,
  isScanning,
  onScanningChange,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);

  const [error, setError] = useState<string>("");
  const [cameraPermission, setCameraPermission] = useState<
    "granted" | "denied" | "prompt"
  >("prompt");

  // Extract user hash from QR code data
  const extractUserHash = (qrData: string): string | null => {
    try {
      // Expected format: "crypto_wallet_[hash]"
      const match = qrData.match(/crypto_wallet_([a-f0-9]+)/i);
      return match ? match[1] : null;
    } catch (error) {
      console.error("Error extracting hash:", error);
      return null;
    }
  };

  // Real QR code detection using jsQR
  const detectQRCode = (canvas: HTMLCanvasElement): string | null => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    return code ? code.data : null;
  };

  // Start camera
  const startCamera = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      setCameraPermission("granted");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        onScanningChange(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraPermission("denied");
      setError(
        "Camera access denied. Please allow camera permission and try again."
      );
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    onScanningChange(false);
  };

  // Scan for QR codes
  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Try to detect QR code
    const qrData = detectQRCode(canvas);

    if (qrData) {
      onQRDetected(qrData);
      stopCamera();
    }
  };

  // Start scanning when camera is ready
  useEffect(() => {
    if (isScanning && videoRef.current) {
      const video = videoRef.current;
      const onLoadedMetadata = () => {
        // Start scanning interval
        scanIntervalRef.current = window.setInterval(scanFrame, 100);
      };

      video.addEventListener("loadedmetadata", onLoadedMetadata);

      return () => {
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
      };
    }
  }, [isScanning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Camera Controls */}
      <div className="flex gap-2">
        <Button onClick={startCamera} disabled={isScanning} className="flex-1">
          <Camera className="w-4 h-4 mr-2" />
          Start Camera
        </Button>
        <Button
          onClick={stopCamera}
          disabled={!isScanning}
          variant="outline"
          className="flex-1"
        >
          <StopCircle className="w-4 h-4 mr-2" />
          Stop Camera
        </Button>
      </div>

      {/* Camera Feed */}
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Scanning Overlay */}
        {isScanning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-2 border-white border-dashed rounded-lg w-48 h-48 flex items-center justify-center">
              <div className="text-white text-center">
                <Scan className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                <p className="text-sm">Scanning for QR codes...</p>
              </div>
            </div>
          </div>
        )}

        {/* No Camera State */}
        {!isScanning && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Camera not active</p>
            </div>
          </div>
        )}
      </div>

      {/* Camera Permission Error */}
      {cameraPermission === "denied" && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Camera access is required to scan QR codes. Please allow camera
            permission in your browser settings.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
