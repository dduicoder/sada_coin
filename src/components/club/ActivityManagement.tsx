"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Activity as ActivityIcon,
} from "lucide-react";
import { Activity } from "@/../types";
import { ServerResponseAlert } from "./ServerResponseAlert";

interface ActivityFormData {
  title: string;
  description: string;
  amount: number;
  type: "club_to_student" | "student_to_club";
  club_id: string;
}

interface ServerResponse {
  success?: boolean;
  message: string;
  error?: string;
}

interface ActivityManagementProps {
  activities: Activity[];
  selectedActivity: Activity | null;
  onActivitySelect: (activity: Activity) => void;
  onActivitiesUpdate: () => void;
}

export const ActivityManagement: React.FC<ActivityManagementProps> = ({
  activities,
  selectedActivity,
  onActivitySelect,
  onActivitiesUpdate,
}) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [serverResponse, setServerResponse] = useState<ServerResponse | null>(
    null
  );
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());

  const form = useForm<ActivityFormData>({
    defaultValues: {
      title: "",
      description: "",
      amount: 0,
      type: "club_to_student",
      club_id: "",
    },
  });

  useEffect(() => {
    if (session?.user?.id) {
      form.setValue("club_id", session.user.id);
    }
  }, [session?.user?.id, form]);

  const handleCreateActivity = async (data: ActivityFormData) => {
    setLoading(true);
    setServerResponse(null);

    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setServerResponse({ success: true, message: result.message });
        setDialogOpen(false);
        form.reset();
        onActivitiesUpdate();
      } else {
        setServerResponse({ success: false, message: result.message });
      }
    } catch (error) {
      setServerResponse({
        success: false,
        message: "네트워크 오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateActivity = async (data: ActivityFormData) => {
    if (!editingActivity) return;

    setLoading(true);
    setServerResponse(null);

    try {
      const response = await fetch(`/api/activities/${editingActivity.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          amount: data.amount,
          type: data.type,
          club_id: data.club_id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setServerResponse({ success: true, message: result.message });
        setDialogOpen(false);
        setEditingActivity(null);
        form.reset();
        onActivitiesUpdate();
      } else {
        setServerResponse({ success: false, message: result.message });
      }
    } catch (error) {
      setServerResponse({
        success: false,
        message: "네트워크 오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async (activityId: number) => {
    if (!confirm("정말로 이 활동을 삭제하시겠습니까?")) return;

    setLoading(true);
    setServerResponse(null);

    try {
      const response = await fetch(`/api/activities/${activityId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        setServerResponse({ success: true, message: result.message });
        onActivitiesUpdate();
      } else {
        setServerResponse({ success: false, message: result.message });
      }
    } catch (error) {
      setServerResponse({
        success: false,
        message: "네트워크 오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingActivity(null);
    form.reset({
      title: "",
      description: "",
      amount: 0,
      type: "club_to_student",
      club_id: session?.user?.id || "",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (activity: Activity) => {
    setEditingActivity(activity);
    form.reset({
      title: activity.title,
      description: activity.description,
      amount: activity.amount,
      type: activity.type,
      club_id: activity.club_id,
    });
    setDialogOpen(true);
  };

  const onSubmit = (data: ActivityFormData) => {
    if (editingActivity) {
      handleUpdateActivity(data);
    } else {
      handleCreateActivity(data);
    }
  };

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ActivityIcon className="w-5 h-5" />
          활동 관리
        </CardTitle>
        <CardDescription>
          동아리 활동을 생성, 수정, 삭제할 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">활동 목록</h3>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openCreateDialog}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />새 활동 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingActivity ? "활동 수정" : "새 활동 추가"}
                </DialogTitle>
                <DialogDescription>활동 정보를 입력해주세요.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{ required: "활동명은 필수입니다." }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>활동명</FormLabel>
                        <FormControl>
                          <Input placeholder="활동명을 입력하세요" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    rules={{ required: "활동 설명은 필수입니다." }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>활동 설명</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="활동 설명을 입력하세요"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    rules={{
                      required: "금액은 필수입니다.",
                      min: { value: 1, message: "금액은 1 이상이어야 합니다." },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>금액</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="금액을 입력하세요"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    rules={{ required: "활동 타입은 필수입니다." }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>활동 타입</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="활동 타입을 선택하세요" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="club_to_student">
                              동아리 → 학생 (코인 지급)
                            </SelectItem>
                            <SelectItem value="student_to_club">
                              학생 → 동아리 (코인 사용)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          처리 중...
                        </>
                      ) : (
                        <>{editingActivity ? "수정" : "추가"}</>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {loading && !dialogOpen && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}

        {!loading && activities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            등록된 활동이 없습니다.
          </div>
        )}

        {activities.length > 0 && (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>활동명</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead>금액</TableHead>
                  <TableHead>타입</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow
                    key={activity.id}
                    className={`cursor-pointer transition-colors ${
                      selectedActivity?.id === activity.id
                        ? "bg-blue-50 hover:bg-blue-50 dark:bg-blue-950 border-blue-500"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => onActivitySelect(activity)}
                  >
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
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDescription(activity.id);
                            }}
                            className="p-0 h-auto text-blue-600 hover:text-blue-800 mt-1"
                          >
                            {expandedDescriptions.has(activity.id)
                              ? "접기"
                              : "더보기"}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{activity.amount} 코인</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          activity.type === "club_to_student"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {activity.type === "club_to_student"
                          ? "코인 지급"
                          : "코인 사용"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div
                        className="flex gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(activity)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteActivity(activity.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <ServerResponseAlert response={serverResponse} />
      </CardContent>
    </Card>
  );
};
