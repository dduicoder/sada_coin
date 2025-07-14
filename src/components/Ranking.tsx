"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { RefreshCw, Trophy } from "lucide-react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import Image from "next/image";
import { clubs } from "@/constants/clubs";

interface UserBalance {
  balance: number;
  club_id: string;
  id: string;
  name: string;
}

interface ClubBalance {
  balance: number;
  id: string;
  name: string;
}

export const getClubNameById = (id: string): string => {
  for (const subject of clubs) {
    const club = subject.clubs_list.find((c) => c.id === id);
    if (club) {
      return club.name;
    }
  }
  return "";
};

const Ranking = () => {
  const [userLoading, setUserLoading] = useState(false);
  const [clubLoading, setClubLoading] = useState(false);
  const [userRanking, setUserRanking] = useState<UserBalance[]>([]);
  const [clubRanking, setClubRanking] = useState<ClubBalance[]>([]);
  const [userLastUpdate, setUserLastUpdate] = useState<Date | null>(null);
  const [clubLastUpdate, setClubLastUpdate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredUserRanking = userRanking.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.includes(searchTerm) ||
      getClubNameById(user.club_id)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchAndSetUser();
    fetchAndSetClubs();
  }, []);

  return (
    <>
      <Card className="gap-2 mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            유저 코인 랭킹
          </CardTitle>
          <CardDescription className="flex justify-between items-center">
            {userLastUpdate && formatDate(userLastUpdate)} 기준
            <div className="flex items-center gap-2">
              <Input
                placeholder="이름, 학번, 동아리로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48"
              />
              <Button
                onClick={fetchAndSetUser}
                disabled={userLoading}
                variant="outline"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${
                    userLoading ? "animate-spin" : ""
                  }`}
                />
                새로고침
              </Button>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUserRanking && filteredUserRanking.length !== 0 ? (
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-[100px]">학번</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>동아리</TableHead>
                    <TableHead className="text-right">보유 코인</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUserRanking.map((user, i) => (
                    <TableRow key={i}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <Image
                          src={`/clubs/${user.club_id}.png`}
                          alt={getClubNameById(user.club_id)}
                          width={16}
                          height={16}
                          className="inline-block mr-2"
                        />
                        {getClubNameById(user.club_id)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {user.balance}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              {searchTerm ? "검색 결과가 없습니다." : "랭킹 정보가 없습니다."}
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="gap-2 mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            동아리 코인 랭킹
          </CardTitle>
          <CardDescription className="flex justify-between items-center">
            {clubLastUpdate && formatDate(clubLastUpdate)} 기준
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
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
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
            </div>
          ) : (
            <div className="text-center text-gray-500">
              랭킹 정보가 없습니다.
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default Ranking;
