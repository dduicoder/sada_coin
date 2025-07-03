import { TabsContent } from "@radix-ui/react-tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { NotebookPen, RefreshCw, Wallet } from "lucide-react";
import { User } from "@/../types";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const Balance = ({ user }: { user: User }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  async function fetchBalance() {
    setLoading(true);
    const response = await fetch(`/api/user-balance?id=${user.id}`);
    const json = await response.json();

    setBalance(json["balance"]);
    setLoading(false);
  }

  useEffect(() => {
    fetchBalance();
  });

  return (
    <TabsContent value="wallet" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />내 계좌
          </CardTitle>
          <CardDescription>
            <div className="flex-col items-start gap-2">
              <div>ID: {user.id}</div>
              <div>Hash: {user.hash}</div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="text-sm opacity-90">총 코인</div>
                  <div className="text-3xl font-bold">
                    {formatPrice(balance)}
                  </div>
                </div>

                <Button onClick={fetchBalance} disabled={loading}>
                  <RefreshCw className={loading ? "animate-spin" : ""} />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <CardTitle className="flex items-center gap-2 mb-6 mt-6">
                <NotebookPen className="w-5 h-5" />내 활동
              </CardTitle>
              {/* {Object.entries(userBalance.coins).map(([coinId, holding]) => {
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
              })} */}
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
export default Balance;
