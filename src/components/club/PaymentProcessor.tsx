"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Send,
  Loader2,
  CreditCard,
  ArrowRight,
  User,
  Building,
  AlertCircle,
} from "lucide-react";
import { Activity } from "@/../types";
import { ServerResponseAlert } from "./ServerResponseAlert";

interface PaymentRequest {
  sender_hash: string;
  receiver_hash: string;
  amount: number;
  title: string;
  transaction_type: string;
}

interface ServerResponse {
  success?: boolean;
  message: string;
  error?: string;
}

interface PaymentProcessorProps {
  userHash?: string;
  selectedActivity: Activity | null;
  onPaymentComplete: () => void;
}

export const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  userHash,
  selectedActivity,
  onPaymentComplete,
}) => {
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [serverResponse, setServerResponse] = useState<ServerResponse | null>(null);

  const sendToServer = async (paymentData: PaymentRequest): Promise<ServerResponse> => {
    try {
      const response = await fetch("/api/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Transfer failed",
          error: data.message || "Unknown error",
        };
      }

      return {
        success: data.success,
        message: data.message,
      };
    } catch (error) {
      console.error("Transfer error:", error);
      return {
        success: false,
        message: "Network error occurred",
        error: "Failed to connect to server",
      };
    }
  };

  const processPayment = async () => {
    if (!userHash || !selectedActivity || !session?.user) {
      setServerResponse({
        success: false,
        message: "활동을 선택하고 유저를 스캔해 주세요.",
      });
      return;
    }

    const numAmount = selectedActivity.amount;
    if (isNaN(numAmount) || numAmount <= 0) {
      setServerResponse({
        success: false,
        message: "올바르지 않은 금액입니다.",
      });
      return;
    }

    setIsProcessing(true);
    setServerResponse(null);

    try {
      let sender_hash: string;
      let receiver_hash: string;

      const clubHash = session.user.hash;

      if (selectedActivity?.type === "club_to_student") {
        sender_hash = clubHash;
        receiver_hash = userHash;
      } else {
        sender_hash = userHash;
        receiver_hash = clubHash;
      }

      const response = await sendToServer({
        sender_hash,
        receiver_hash,
        amount: numAmount,
        title: selectedActivity.title,
        transaction_type: selectedActivity.type,
      });

      setServerResponse(response);
      if (response.success) {
        onPaymentComplete();
      }
    } catch (err) {
      setServerResponse({
        success: false,
        message: "결제 처리 중 오류가 발생했습니다.",
      });
      console.error("Payment error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!userHash) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            결제 처리
          </CardTitle>
          <CardDescription>QR 코드를 스캔하여 사용자를 선택해주세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              QR 코드를 스캔하여 사용자를 선택해주세요.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          결제 처리
        </CardTitle>
        <CardDescription>활동을 선택하고 결제를 처리하세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedActivity && userHash && session?.user && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">결제 미리보기</h3>

            {/* Payment Direction */}
            <div className="flex items-center justify-center mb-4">
              {selectedActivity.type === "club_to_student" ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 rounded-lg">
                    <Building className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      {session.user.name}
                    </span>
                  </div>
                  <ArrowRight className="w-6 h-6 text-green-600" />
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
                    <User className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">{userHash}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-orange-100 rounded-lg">
                    <User className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">{userHash}</span>
                  </div>
                  <ArrowRight className="w-6 h-6 text-red-600" />
                  <div className="flex items-center gap-2 px-3 py-2 bg-red-100 rounded-lg">
                    <Building className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      {session.user.name}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Details */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">활동명:</span>
                <span className="text-sm font-medium">{selectedActivity.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">금액:</span>
                <span
                  className={`text-lg font-bold ${
                    selectedActivity.type === "club_to_student"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedActivity.amount} 코인
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">분류:</span>
                <Badge
                  variant={
                    selectedActivity.type === "club_to_student" ? "default" : "secondary"
                  }
                  className="text-xs"
                >
                  {selectedActivity.type === "club_to_student" ? "코인 획득" : "코인 사용"}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Payment Button */}
        <Button
          onClick={processPayment}
          disabled={!userHash || !selectedActivity || isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              처리 중...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              {selectedActivity ? "결제 전송" : "활동을 선택해주세요"}
            </>
          )}
        </Button>

        <ServerResponseAlert response={serverResponse} />
      </CardContent>
    </Card>
  );
};