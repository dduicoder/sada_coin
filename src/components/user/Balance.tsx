import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NotebookPen, RefreshCw, Wallet, QrCode } from "lucide-react";
import { User } from "@/../types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useQRCode } from "next-qrcode";

const Balance = ({ user }: { user: User }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);

  const { Image } = useQRCode();

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
  }, [user.id]);

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
            text={user.hash}
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
          <CardTitle className="flex items-center gap-2">
            <NotebookPen className="w-5 h-5" />내 활동
          </CardTitle>
          <CardDescription>잘 즐기고 계신가요?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">
            활동 기록이 표시됩니다.
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
export default Balance;
