import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { RefreshCw, Trophy } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useEffect, useState } from "react";
import Image from "next/image";

interface UserBalance {
  balance: number;
  club_id: string;
  club_name: string;
  id: string;
  name: string;
}

interface ClubBalance {
  balance: number;
  id: string;
  name: string;
}

const Ranking = () => {
  const [userLoading, setUserLoading] = useState(false);
  const [clubLoading, setClubLoading] = useState(false);
  const [userRanking, setUserRanking] = useState<UserBalance[]>([]);
  const [clubRanking, setClubRanking] = useState<ClubBalance[]>([]);
  const [userLastUpdate, setUserLastUpdate] = useState<Date>(new Date());
  const [clubLastUpdate, setClubLastUpdate] = useState<Date>(new Date());

  async function fetchAndSetUser() {
    setUserLoading(true);
    const response = await fetch("/api/user-ranking");
    const json: UserBalance[] = await response.json();
    setUserRanking(json);
    setUserLoading(false);
    setUserLastUpdate(new Date());
  }

  async function fetchAndSetClubs() {
    setClubLoading(true);
    const response = await fetch("/api/club-ranking");
    const json: ClubBalance[] = await response.json();
    setClubRanking(json);
    setClubLoading(false);
    setClubLastUpdate(new Date());
  }

  const formatDate = (date: Date): string => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
      `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds()
      )}`
    );
  };

  useEffect(() => {
    fetchAndSetUser();
    fetchAndSetClubs();
  }, []);

  return (
    <TabsContent value="rankings" className="space-y-4">
      <Card className="gap-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            유저 코인 랭킹
          </CardTitle>
          <CardDescription className="flex justify-between items-center">
            {formatDate(userLastUpdate)} 기준
            <Button
              onClick={fetchAndSetUser}
              disabled={userLoading}
              variant="outline"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${userLoading ? "animate-spin" : ""}`}
              />
              새로고침
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userRanking && userRanking.length !== 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">학번</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>동아리</TableHead>
                  <TableHead className="text-right">보유 코인</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userRanking.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <Image
                        src={`/clubs/${user.club_id}.png`}
                        alt={user.club_name}
                        width={16}
                        height={16}
                        className="inline-block mr-2"
                      />
                      {user.club_name}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {user.balance}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-gray-500">
              랭킹 정보가 없습니다.
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="gap-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            동아리 코인 랭킹
          </CardTitle>
          <CardDescription className="flex justify-between items-center">
            {formatDate(clubLastUpdate)} 기준
            <Button
              onClick={fetchAndSetClubs}
              disabled={clubLoading}
              variant="outline"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${clubLoading ? "animate-spin" : ""}`}
              />
              새로고침
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clubRanking && clubRanking.length !== 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">동아리</TableHead>
                  <TableHead className="text-right">보유 코인</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clubRanking.map((club) => (
                  <TableRow key={club.id}>
                    <TableCell>
                      <Image
                        src={`/clubs/${club.id}.png`}
                        alt={club.name}
                        width={16}
                        height={16}
                        className="inline-block mr-2"
                      />
                      {club.name}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {club.balance}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-gray-500">
              랭킹 정보가 없습니다.
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default Ranking;
