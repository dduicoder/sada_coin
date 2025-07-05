"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, CheckCircle } from "lucide-react";
import { QRCamera } from "./QRCamera";

interface QRScannerProps {
  onScanResult: (result: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanResult }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const handleQRDetected = (data: string) => {
    setScanResult(data);
    onScanResult(data);
  };

  return (
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
        <QRCamera
          onQRDetected={handleQRDetected}
          isScanning={isScanning}
          onScanningChange={setIsScanning}
        />

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
                  <strong>Data:</strong> {scanResult}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
