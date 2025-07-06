"use client";

import React, { useState } from "react";
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
  CheckCircle,
  AlertCircle,
  ArrowRight,
  User,
  Building,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { PREDEFINED_ACTIVITIES, Activity } from "@/data/activities";

interface PaymentRequest {
  fromUserId: string;
  toUserHash: string;
  amount: number;
}

interface ServerResponse {
  success: boolean;
  message: string;
  error?: string;
}

interface PaymentFormProps {
  userHash: string;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ userHash }) => {
  const { data: session } = useSession();
  const [amount, setAmount] = useState<string>("");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [serverResponse, setServerResponse] = useState<ServerResponse | null>(
    null
  );
  const [error, setError] = useState<string>("");

  // Real API call to transfer endpoint
  const sendToServer = async (
    paymentData: PaymentRequest
  ): Promise<ServerResponse> => {
    try {
      const response = await fetch("/api/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_hash: paymentData.fromUserId,
          receiver_hash: paymentData.toUserHash,
          amount: paymentData.amount,
          description: selectedActivity?.title || "QR 코드 송금",
        }),
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

  // Process payment
  const processPayment = async () => {
    if (!session?.user?.id) {
      setError("You must be logged in to make a transfer");
      return;
    }

    if (!userHash || !amount) {
      setError("Please fill in all required fields");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setIsProcessing(true);
    setServerResponse(null);
    setError("");

    try {
      // Determine sender and receiver based on activity type
      let senderHash: string;
      let receiverHash: string;

      if (selectedActivity?.type === "club_to_student") {
        // Club sends to student
        senderHash = session.user.hash; // Club's hash
        receiverHash = userHash; // Student's hash from QR scan
      } else if (selectedActivity?.type === "student_to_club") {
        // Student sends to club
        senderHash = userHash; // Student's hash from QR scan
        receiverHash = session.user.hash; // Club's hash
      } else {
        // Default: club sends to student
        senderHash = session.user.hash;
        receiverHash = userHash;
      }

      const paymentData: PaymentRequest = {
        fromUserId: senderHash,
        toUserHash: receiverHash,
        amount: numAmount,
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

  // Handle activity selection
  const handleActivitySelect = (activity: Activity) => {
    setSelectedActivity(activity);
    setAmount(activity.amount.toString());
  };

  return (
    <Card className="mb-12">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          결제 처리
        </CardTitle>
        <CardDescription>스캔된 유저로 결제를 진행합니다</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 활동 선택 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            활동 선택:
          </label>
          <div className="grid grid-cols-1 gap-2 max-h-120 pt-4 pb-4 overflow-y-auto">
            {PREDEFINED_ACTIVITIES.map((activity) => (
              <button
                key={activity.id}
                onClick={() => handleActivitySelect(activity)}
                className={`p-3 text-left rounded-lg border transition-colors ${
                  selectedActivity?.id === activity.id
                    ? "bg-blue-50 border-blue-500"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 font-medium text-sm">
                      {activity.title}
                    </div>
                    <p className="text-xs text-gray-600">
                      {activity.description}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`ml-2 ${
                      activity.type === "club_to_student"
                        ? "text-green-600 border-green-600"
                        : "text-red-600 border-red-600"
                    }`}
                  >
                    {activity.amount}원
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 결제 미리보기 */}
        {selectedActivity && userHash && amount && session?.user && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              결제 미리보기
            </h3>

            {/* 결제 방향 */}
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
                    <span className="text-sm font-medium text-green-800">
                      {userHash}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-orange-100 rounded-lg">
                    <User className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      {userHash}
                    </span>
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

            {/* 결제 상세 정보 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">활동명:</span>
                <span className="text-sm font-medium">
                  {selectedActivity.title}
                </span>
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
                  {amount} 코인
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">분류:</span>
                <Badge
                  variant={
                    selectedActivity.type === "club_to_student"
                      ? "default"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {selectedActivity.type === "club_to_student"
                    ? "코인 획득"
                    : "코인 사용"}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* 결제 실행 버튼 */}
        <Button
          onClick={processPayment}
          disabled={!userHash || !amount || isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              처리 중...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              결제 전송
            </>
          )}
        </Button>

        {/* 오류 표시 */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 서버 응답 표시 */}
        {serverResponse && (
          <Alert variant={serverResponse.success ? "default" : "destructive"}>
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
                {serverResponse.error && (
                  <div className="text-sm text-red-600">
                    <strong>오류:</strong> {serverResponse.error}
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
