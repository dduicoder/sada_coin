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
  const [didScan, setDidScan] = useState<boolean>(false);

  const handleQRDetected = (data: string) => {
    setDidScan(true);
    onScanResult(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          QR 코드 스캐너
        </CardTitle>
        <CardDescription>
          카메라를 QR 코드에 맞추면 사용자 정보를 스캔합니다
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <QRCamera
          onQRDetected={handleQRDetected}
          isScanning={isScanning}
          onScanningChange={setIsScanning}
        />

        {/* 스캔 결과 */}
        {didScan && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <div>
                  <strong>QR 코드가 감지되었습니다!</strong>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
