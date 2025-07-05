"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera, Scan, Send, Wallet } from "lucide-react";

export const InstructionsCard: React.FC = () => {
  return (
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
  );
};