"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Camera,
  Scan,
  StopCircle,
  CheckCircle,
  AlertCircle,
  Send,
  Loader2,
  RefreshCw,
  User,
  Hash,
  CreditCard,
  Wallet,
} from "lucide-react";

// Types
interface QRScanResult {
  data: string;
  timestamp: Date;
}

interface PaymentRequest {
  fromUserId: string;
  toUserHash: string;
  amount: number;
  currency: string;
  timestamp: Date;
}

interface ServerResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  error?: string;
}

const QRScannerPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<QRScanResult | null>(null);
  const [userHash, setUserHash] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");
  const [isProcessing, setIsProcessing] = useState(false);
  const [serverResponse, setServerResponse] = useState<ServerResponse | null>(
    null
  );
  const [fromUserId, setFromUserId] = useState<string>("user_sender_123");
  const [error, setError] = useState<string>("");
  const [cameraPermission, setCameraPermission] = useState<
    "granted" | "denied" | "prompt"
  >("prompt");

  // Dummy server function
  const sendToServer = async (
    paymentData: PaymentRequest
  ): Promise<ServerResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate server processing
        const success = Math.random() > 0.1; // 90% success rate

        if (success) {
          resolve({
            success: true,
            message: "Payment processed successfully",
            transactionId: `txn_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 9)}`,
          });
        } else {
          resolve({
            success: false,
            message: "Payment failed",
            error: "Insufficient funds or network error",
          });
        }
      }, 2000); // Simulate network delay
    });
  };

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

  // Simple QR code detection (simplified for demo)
  const detectQRCode = (canvas: HTMLCanvasElement): string | null => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // This is a simplified QR detection - in a real app, you'd use a library like jsQR
    // For demo purposes, we'll simulate QR detection
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Simulate QR code detection with random success
    if (Math.random() > 0.7) {
      // Return a mock QR code result
      const mockHashes = [
        "crypto_wallet_a1b2c3d4",
        "crypto_wallet_e5f6g7h8",
        "crypto_wallet_i9j0k1l2",
        "crypto_wallet_m3n4o5p6",
      ];
      return mockHashes[Math.floor(Math.random() * mockHashes.length)];
    }

    return null;
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
        setIsScanning(true);
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
    setIsScanning(false);
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
      const hash = extractUserHash(qrData);
      if (hash) {
        setScanResult({
          data: qrData,
          timestamp: new Date(),
        });
        setUserHash(hash);
        stopCamera();
        return;
      }
    }

    // Continue scanning
    if (isScanning) {
      requestAnimationFrame(scanFrame);
    }
  };

  // Start scanning when camera is ready
  useEffect(() => {
    if (isScanning && videoRef.current) {
      const video = videoRef.current;
      video.addEventListener("loadedmetadata", () => {
        scanFrame();
      });
    }
  }, [isScanning]);

  // Process payment
  const processPayment = async () => {
    if (!userHash || !amount || !fromUserId) {
      setError("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);
    setServerResponse(null);
    setError("");

    try {
      const paymentData: PaymentRequest = {
        fromUserId,
        toUserHash: userHash,
        amount: parseFloat(amount),
        currency,
        timestamp: new Date(),
      };

      const response = await sendToServer(paymentData);
      setServerResponse(response);
    } catch (err) {
      setError("Failed to process payment");
      console.error("Payment error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setScanResult(null);
    setUserHash("");
    setAmount("");
    setServerResponse(null);
    setError("");
  };

  return (
    <main className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <Scan className="text-indigo-600" />
          QR 스캐너
        </h1>
        <p className="text-slate-600">
          Scan QR codes to process crypto payments
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              How to Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Camera className="w-6 h-6 text-indigo-600" />
                </div>
                <h4 className="font-medium mb-1">1. Start Camera</h4>
                <p className="text-slate-600">
                  Allow camera access and start scanning
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Scan className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium mb-1">2. Scan QR Code</h4>
                <p className="text-slate-600">
                  Point camera at the payment QR code
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Send className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium mb-1">3. Send Payment</h4>
                <p className="text-slate-600">
                  Enter amount and process payment
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Scanner Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              QR Code Scanner
            </CardTitle>
            <CardDescription>
              Point your camera at a QR code to scan payment information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera Controls */}
            <div className="flex gap-2">
              <Button
                onClick={startCamera}
                disabled={isScanning}
                className="flex-1"
              >
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
                  Camera access is required to scan QR codes. Please allow
                  camera permission in your browser settings.
                </AlertDescription>
              </Alert>
            )}

            {/* Scan Result */}
            {scanResult && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <div>
                      <strong>QR Code Detected!</strong>
                    </div>
                    <div className="text-sm">
                      <strong>Data:</strong> {scanResult.data}
                    </div>
                    <div className="text-sm">
                      <strong>Scanned:</strong>{" "}
                      {scanResult.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Payment Processing Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Processing
            </CardTitle>
            <CardDescription>
              Process payment to the scanned wallet address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* From User ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                From User ID:
              </label>
              <Input
                value={fromUserId}
                onChange={(e) => setFromUserId(e.target.value)}
                placeholder="Enter your user ID"
                className="w-full"
              />
            </div>

            {/* Scanned Hash */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Recipient Hash:
              </label>
              <div className="flex gap-2">
                <Input
                  value={userHash}
                  onChange={(e) => setUserHash(e.target.value)}
                  placeholder="Hash will appear after scanning"
                  className="flex-1"
                />
                <Button onClick={resetForm} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              {userHash && (
                <Badge variant="secondary" className="text-xs">
                  <Hash className="w-3 h-3 mr-1" />
                  {userHash}
                </Badge>
              )}
            </div>

            {/* Amount */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Amount:
                </label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Currency:
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="USD">USD</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                </select>
              </div>
            </div>

            {/* Process Payment Button */}
            <Button
              onClick={processPayment}
              disabled={!userHash || !amount || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Payment
                </>
              )}
            </Button>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Server Response */}
            {serverResponse && (
              <Alert
                variant={serverResponse.success ? "default" : "destructive"}
              >
                {serverResponse.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  <div className="space-y-1">
                    <div>
                      <strong>{serverResponse.message}</strong>
                    </div>
                    {serverResponse.transactionId && (
                      <div className="text-sm">
                        <strong>Transaction ID:</strong>{" "}
                        {serverResponse.transactionId}
                      </div>
                    )}
                    {serverResponse.error && (
                      <div className="text-sm text-red-600">
                        <strong>Error:</strong> {serverResponse.error}
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Manual Hash Entry */}
            <div className="pt-4 border-t">
              <p className="text-sm text-slate-600 mb-2">
                You can also manually enter a hash for testing:
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => setUserHash("a1b2c3d4")}
                  variant="outline"
                  size="sm"
                >
                  Test Hash 1
                </Button>
                <Button
                  onClick={() => setUserHash("e5f6g7h8")}
                  variant="outline"
                  size="sm"
                >
                  Test Hash 2
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default QRScannerPage;
