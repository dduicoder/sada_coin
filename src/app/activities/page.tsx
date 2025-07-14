"use client";
import { useEffect, useState } from "react";
import { Activity } from "../../../types";
import { getClubNameById } from "@/constants/clubs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ActivityPage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(
    new Set()
  );
  const [loading, setLoading] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const result = await fetch("api/activities");
      const json: Activity[] = await result.json();
      setActivities(json);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [setActivities]);

  const groupActivitiesByClub = () => {
    const grouped: { [key: string]: Activity[] } = {};

    activities.forEach((activity) => {
      if (!grouped[activity.club_id]) {
        grouped[activity.club_id] = [];
      }
      grouped[activity.club_id].push(activity);
    });

    return grouped;
  };

  const groupedActivities = groupActivitiesByClub();

  const filteredGroupedActivities = Object.fromEntries(
    Object.entries(groupedActivities).filter(([clubId, clubActivities]) => {
      const clubName = getClubNameById(clubId);
      return (
        clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clubId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
  );

  const toggleDescription = (activityId: number) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId);
    } else {
      newExpanded.add(activityId);
    }
    setExpandedDescriptions(newExpanded);
  };

  const truncateDescription = (description: string, limit: number = 100) => {
    if (description.length <= limit) return description;
    return description.substring(0, limit) + "...";
  };

  return (
    <main className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">동아리별 활동</h1>
        <Button
          onClick={fetchActivities}
          variant="outline"
          className="flex items-center gap-2"
          disabled={loading}
        >
          {loading ? "로딩 중..." : "새로고침"}
        </Button>
      </div>

      <div className="max-w-md mx-auto">
        <Input
          type="text"
          placeholder="동아리 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-gray-500 mt-2">활동을 불러오는 중...</p>
        </div>
      )}

      {!loading && Object.entries(filteredGroupedActivities).map(
        ([clubId, clubActivities]) => (
          <Card key={clubId} className="w-full">
            <CardHeader>
              <CardTitle className="text-xl">
                {getClubNameById(clubId)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>총 {clubActivities.length}개의 활동</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>제목</TableHead>
                    <TableHead>설명</TableHead>
                    <TableHead>금액</TableHead>
                    <TableHead>타입</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clubActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">
                        {activity.title}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div>
                          <div className="whitespace-pre-wrap">
                            {expandedDescriptions.has(activity.id)
                              ? activity.description
                              : truncateDescription(activity.description)}
                          </div>
                          {activity.description.length > 100 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleDescription(activity.id)}
                              className="p-0 h-auto text-blue-600 hover:text-blue-800 mt-1"
                            >
                              {expandedDescriptions.has(activity.id)
                                ? "접기"
                                : "더보기"}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {activity.amount.toLocaleString()} 코인
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            activity.type === "club_to_student"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {activity.type === "club_to_student"
                            ? "코인 사용"
                            : "코인 지급"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      )}

      {!loading && Object.keys(filteredGroupedActivities).length === 0 &&
        activities.length > 0 && (
          <div className="text-center text-gray-500 py-8">
            검색 결과가 없습니다.
          </div>
        )}

      {!loading && activities.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          아직 등록된 활동이 없습니다.
        </div>
      )}
    </main>
  );
};

export default ActivityPage;
