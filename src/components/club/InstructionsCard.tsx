"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Scan, Send, Wallet } from "lucide-react";

export const InstructionsCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          이용 방법
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Camera className="w-6 h-6 text-indigo-600" />
            </div>
            <h4 className="font-medium mb-1">1. 카메라 시작</h4>
            <p className="text-slate-600 dark:text-gray-400">
              카메라 접근을 허용하고 스캔을 시작하세요
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Scan className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-medium mb-1">2. QR 코드 스캔</h4>
            <p className="text-slate-600 dark:text-gray-400">
              결제 QR 코드를 카메라에 비추세요
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Send className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium mb-1">3. 결제 진행</h4>
            <p className="text-slate-600 dark:text-gray-400">
              활동을 선택하고 결제를 완료하세요
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
