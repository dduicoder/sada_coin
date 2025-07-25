import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NotebookPen, RefreshCw, Wallet, QrCode } from "lucide-react";
import { Transaction, User } from "@/../types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useQRCode } from "next-qrcode";
import Link from "next/link";

const Balance = ({ user }: { user: User }) => {
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const [activityLoading, setActivityLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const { Image } = useQRCode();

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  async function fetchNew() {
    fetchBalance();
    fetchAcitivies();
  }

  async function fetchBalance() {
    setBalanceLoading(true);
    const response = await fetch(`/api/user-balance?id=${user.id}`);
    const json = await response.json();

    setBalance(json["balance"]);
    setBalanceLoading(false);
  }

  async function fetchAcitivies() {
    setActivityLoading(true);
    const response = await fetch(`/api/user-transactions?hash=${user.hash}`);
    const json = await response.json();

    setTransactions(json);
    setActivityLoading(false);
  }

  useEffect(() => {
    fetchNew();
  }, [user.id, user.hash]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />내 계좌
          </CardTitle>
          <CardAction>
            <Button>
              <Link href={"/ranking"}>코인 랭킹</Link>
            </Button>
          </CardAction>
          <CardDescription>ID: {user.id}</CardDescription>
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

                <Button onClick={fetchNew} disabled={balanceLoading}>
                  <RefreshCw className={balanceLoading ? "animate-spin" : ""} />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            활동 QR 코드
          </CardTitle>
          <CardDescription>
            각 부스에서 QR 코드를 스캔해 코인을 사용하고 획득하세요!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Image
            text={JSON.stringify({
              hash: user.hash,
              name: `${user.id} ${user.name}`,
            })}
            options={{
              type: "image/jpeg",
              quality: 1,
              errorCorrectionLevel: "M",
              margin: 3,
              scale: 4,
              width: 240,
              color: {
                dark: "#000",
                light: "#FFFFFF",
              },
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <NotebookPen className="w-5 h-5" />내 활동
            </div>
            <Button onClick={fetchNew} disabled={activityLoading} size="sm">
              <RefreshCw className={activityLoading ? "animate-spin" : ""} />
            </Button>
          </CardTitle>
          <CardDescription>잘 즐기고 계신가요?</CardDescription>
        </CardHeader>
        <CardContent>
          {activityLoading ? (
            <div className="text-center text-gray-500">
              활동 기록을 불러오는 중...
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center text-gray-500">
              활동 기록이 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction, index) => {
                console.log(transaction);
                const isOutgoing =
                  transaction.transaction_type === "student_to_club";
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-secondary rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{transaction.title}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(transaction.timestamp).toLocaleString(
                          "ko-KR"
                        )}
                      </div>
                    </div>
                    <div
                      className={`font-bold ${
                        isOutgoing ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {isOutgoing ? "-" : "+"}
                      {formatPrice(Math.abs(transaction.amount))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
export default Balance;
