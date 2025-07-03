"use client";

import React, { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  QrCode,
  Copy,
  RefreshCw,
  DollarSign,
  Trophy,
  User,
  Hash,
  NotebookPen,
} from "lucide-react";

// Types
interface Coin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number;
  image: string;
  total_volume: number;
}

interface UserBalance {
  userId: string;
  totalBalance: number;
  coins: {
    [key: string]: {
      amount: number;
      value: number;
    };
  };
}

// Mock data for demonstration
const mockCoins: Coin[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    current_price: 43250.5,
    price_change_percentage_24h: 2.45,
    market_cap: 847000000000,
    market_cap_rank: 1,
    image: "🪙",
    total_volume: 15000000000,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    current_price: 2680.75,
    price_change_percentage_24h: -1.23,
    market_cap: 322000000000,
    market_cap_rank: 2,
    image: "💎",
    total_volume: 8500000000,
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    current_price: 0.485,
    price_change_percentage_24h: 5.67,
    market_cap: 17000000000,
    market_cap_rank: 3,
    image: "🔷",
    total_volume: 450000000,
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    current_price: 98.32,
    price_change_percentage_24h: -0.89,
    market_cap: 42000000000,
    market_cap_rank: 4,
    image: "☀️",
    total_volume: 1200000000,
  },
];

const mockUserBalance: UserBalance = {
  userId: "user_abc123xyz789",
  totalBalance: 15750.25,
  coins: {
    bitcoin: { amount: 0.25, value: 10812.63 },
    ethereum: { amount: 1.5, value: 4021.13 },
    cardano: { amount: 1890, value: 916.65 },
    solana: { amount: 0.0, value: 0 },
  },
};

// QR Code Component (simplified representation)
const QRCodeDisplay: React.FC<{ data: string }> = ({ data }) => {
  const qrPattern = [
    "█████████████████████████",
    "█       █   █ █ █       █",
    "█ █████ █ ███ █ █ █████ █",
    "█ █████ █  ██   █ █████ █",
    "█ █████ █ █ █ █ █ █████ █",
    "█       █ █   █ █       █",
    "█████████ █ █ █ █████████",
    "        █   █ █         ",
    "██ ███ ██ █████ ██ ███ █",
    "█  █ █  █   █ █  █  █ ██",
    "███████ █ █████ ███████ █",
    "█     █ █   █ █ █     ███",
    "█████ ███ █████ █████ ███",
    "        █ █   █         ",
    "█████████ █ █ █ █████████",
    "█       █   █ █ █       █",
    "█ █████ █ ███ █ █ █████ █",
    "█ █████ █  ██   █ █████ █",
    "█ █████ █ █ █ █ █ █████ █",
    "█       █ █   █ █       █",
    "█████████████████████████",
  ];

  return (
    <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
      <div className="font-mono text-xs leading-none select-none">
        {qrPattern.map((row, i) => (
          <div key={i}>{row}</div>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-600 text-center break-all">
        {data.substring(0, 32)}...
      </div>
    </div>
  );
};

const CoinRankingDashboard: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>(mockCoins);
  const [userBalance, setUserBalance] = useState<UserBalance>(mockUserBalance);
  const [userId, setUserId] = useState(mockUserBalance.userId);
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate hash from user ID (simplified)
  const generateUserHash = (id: string): string => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, "0");
  };

  const userHash = generateUserHash(userId);
  const paymentAddress = `crypto_wallet_${userHash}`;

  useEffect(() => {
    setQrData(paymentAddress);
  }, [paymentAddress]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatMarketCap = (cap: number): string => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toFixed(2)}`;
  };

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCoins(
        coins.map((coin) => ({
          ...coin,
          current_price:
            coin.current_price * (1 + (Math.random() - 0.5) * 0.02),
          price_change_percentage_24h:
            coin.price_change_percentage_24h + (Math.random() - 0.5) * 2,
        }))
      );
      setLoading(false);
    }, 1000);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500";
    if (rank === 2) return "bg-gray-400";
    if (rank === 3) return "bg-amber-600";
    return "bg-blue-500";
  };

  return (
    <main>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-800 flex items-center justify-center gap-2">
            2503 박시진 님
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

          {/* Coin Rankings Tab */}
          <TabsContent value="rankings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  유저 코인 랭킹
                </CardTitle>
                <CardDescription>2025.7.3 21:09:41 기준</CardDescription>
                <Button
                  onClick={refreshData}
                  disabled={loading}
                  variant="outline"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                  />
                  새로고침
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">학번</TableHead>
                      <TableHead>이름</TableHead>
                      <TableHead className="text-right">보유 코인</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coins.map((coin) => (
                      <TableRow key={coin.id}>
                        <TableCell className="font-medium">
                          {coin.name} ({coin.symbol.toUpperCase()})
                        </TableCell>
                        <TableCell>{coin.symbol}</TableCell>
                        <TableCell className="text-right">
                          {coin.current_price.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <div className="grid gap-4">
              {coins.map((coin) => (
                <Card
                  key={coin.id}
                  className="hover:shadow-lg transition-shadow p-0"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Badge
                          className={`${getRankBadgeColor(
                            coin.market_cap_rank
                          )} text-white`}
                        >
                          #{coin.market_cap_rank}
                        </Badge>
                        <div className="text-2xl">{coin.image}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800">
                            {coin.name}
                          </h3>
                          <p className="text-slate-500 uppercase">
                            {coin.symbol}
                          </p>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="text-2xl font-bold text-slate-800">
                          {formatPrice(coin.current_price)}
                        </div>
                        <div
                          className={`flex items-center justify-end gap-1 ${
                            coin.price_change_percentage_24h >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {coin.price_change_percentage_24h >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {Math.abs(coin.price_change_percentage_24h).toFixed(
                            2
                          )}
                          %
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />내 계좌
                </CardTitle>
                <CardDescription>User ID: {userId}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                    <div className="text-sm opacity-90">총 코인</div>
                    <div className="text-3xl font-bold">
                      {formatPrice(userBalance.totalBalance)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <CardTitle className="flex items-center gap-2 mb-6 mt-6">
                      <NotebookPen className="w-5 h-5" />내 활동
                    </CardTitle>
                    {Object.entries(userBalance.coins).map(
                      ([coinId, holding]) => {
                        const coin = coins.find((c) => c.id === coinId);
                        if (!coin || holding.amount === 0) return null;

                        return (
                          <div
                            key={coinId}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-xl">{coin.image}</div>
                              <div>
                                <div className="font-medium text-slate-800">
                                  {coin.name}
                                </div>
                                <div className="text-sm text-slate-500">
                                  {holding.amount} {coin.symbol.toUpperCase()}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-slate-800">
                                {formatPrice(holding.value)}
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment QR Tab */}
          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  활동 QR 코드
                </CardTitle>
                <CardDescription>
                  스캔하여 코인 사용 및 획득에 사용하세요!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <QRCodeDisplay data={qrData} />

                    <Alert>
                      <Hash className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <div>
                            <strong>User ID:</strong> {userId}
                          </div>
                          <div>
                            <strong>Hash:</strong> {userHash}
                          </div>
                          <div className="flex items-center gap-2">
                            <strong>Payment Address:</strong>
                            <code className="bg-slate-100 px-2 py-1 rounded text-sm">
                              {paymentAddress}
                            </code>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(paymentAddress)}
                            >
                              <Copy className="w-3 h-3" />
                              {copied ? "Copied!" : "Copy"}
                            </Button>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Change User ID:
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="Enter user ID"
                        className="flex-1"
                      />
                      <Button
                        onClick={() =>
                          setQrData(`crypto_wallet_${generateUserHash(userId)}`)
                        }
                        variant="outline"
                      >
                        Update QR
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default CoinRankingDashboard;
