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
import ClubForm from "@/components/login/ClubForm";

export default function ClubLoginPage() {
  return (
    <main>
      <Card className="mx-auto max-w-sm ">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">동아리 로그인</CardTitle>
          <CardDescription>
            <div>동아리와 비밀번호를 입력해주세요</div>
            <div>
              계정이 없다면?{" "}
              <Link href="../sign-up/club" className="text-blue-400">
                가입하기
              </Link>
            </div>
          </CardDescription>
          <CardAction>
            <Link href="user">
              <Button
                variant="secondary"
                size="icon"
                className="size-full px-3 py-2"
              >
                학생 로그인
                <ChevronRight className="ml-2 size-4" />
              </Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <ClubForm />
        </CardContent>
      </Card>
    </main>
  );
}
