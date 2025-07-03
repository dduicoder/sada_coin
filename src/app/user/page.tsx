"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Wallet, QrCode, Trophy } from "lucide-react";
import { useSession } from "next-auth/react";
import QRCode from "@/components/user/QRCode";
import Balance from "@/components/user/Balance";
import Ranking from "@/components/user/Ranking";

const CoinRankingDashboard = () => {
  const { data: session, status } = useSession();

  if (status !== "authenticated" || !session.user) {
    return <main>접근이 허용되지 않았습니다.</main>;
  }

  const user = session.user;

  if (user.type !== "student") {
    return <main>학생만 접근할 수 있습니다.</main>;
  }

  return (
    <main>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-800 flex items-center justify-center gap-2">
            {user.id} {user.name} 님
          </h1>
          <p className="text-slate-600">
            SADA에서 개발한 코인을 이용해 2025년 학술발표회를 즐겨보세요!
          </p>
        </div>

        <Tabs defaultValue="wallet" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-16">
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />내 계좌
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              QR 코드
            </TabsTrigger>
            <TabsTrigger value="rankings" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              랭킹
            </TabsTrigger>
          </TabsList>

          <Balance user={user} />
          <QRCode user={user} />
          <Ranking />
        </Tabs>
      </div>
    </main>
  );
};

export default CoinRankingDashboard;
