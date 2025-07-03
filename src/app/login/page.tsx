"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import StudentForm from "@/components/login/StudentForm";
import ClubForm from "@/components/login/ClubForm";

export default function Component() {
  const [isStudent, setIsStudent] = useState<boolean>(true);

  return (
    <main>
      <Card className="mx-auto max-w-sm ">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {isStudent ? "학생" : "동아리"} 로그인
          </CardTitle>
          <CardDescription>
            <div>
              {isStudent ? "학번과" : "동아리와"} 비밀번호를 입력해주세요
            </div>
            <div>
              계정이 없다면?{" "}
              <Link
                href={`sign-up/${isStudent ? "user" : "club"}`}
                className="text-blue-400"
              >
                가입하기
              </Link>
            </div>
          </CardDescription>
          <CardAction>
            <Button
              variant="secondary"
              size="icon"
              className="size-full px-3 py-2"
              onClick={() => setIsStudent((prev) => !prev)}
            >
              {isStudent ? "동아리" : "학생"} 로그인{" "}
              <ChevronRight className="ml-2 size-4" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>{isStudent ? <StudentForm /> : <ClubForm />}</CardContent>
      </Card>
    </main>
  );
}
