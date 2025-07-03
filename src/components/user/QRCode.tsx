"use client";
import { TabsContent } from "@radix-ui/react-tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Hash, QrCode } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { User } from "@/../types";
import { useQRCode } from "next-qrcode";

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

const QRCode = ({ user }: { user: User }) => {
  const { Image } = useQRCode();

  return (
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
              <Image
                text={"https://github.com/bunlong/next-qrcode"}
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
              <Alert>
                <Hash className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div>
                      <strong>ID:</strong> {user.id}
                    </div>
                    <div>
                      <strong>Hash:</strong> {user.hash}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default QRCode;
