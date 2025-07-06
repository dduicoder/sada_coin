"use client";

import React, { useState } from "react";
import { Scan } from "lucide-react";
import { useSession } from "next-auth/react";
import { QRScanner, PaymentForm, InstructionsCard } from "@/components/club";

const QRScannerPage: React.FC = () => {
  const { data: session, status } = useSession();
  const [userHash, setUserHash] = useState<string>("");

  if (status !== "authenticated" || !session.user) {
    return <main>접근이 허용되지 않았습니다.</main>;
  }

  const user = session.user;

  if (user.type !== "club") {
    return <main>학생만 접근할 수 있습니다.</main>;
  }

  return (
    <main className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <Scan className="text-indigo-600" />
          QR 스캐너
        </h1>
        <p className="text-slate-600">QR 코드를 스캔하여 결제를 처리하세요</p>
      </div>

      <div className="grid lg:grid-cols-1 gap-6">
        {/* Instructions */}
        <InstructionsCard />

        {/* Scanner Section */}
        <QRScanner onScanResult={setUserHash} />

        {/* Payment Processing Section */}
        <PaymentForm userHash={userHash} />
      </div>
    </main>
  );
};

export default QRScannerPage;
