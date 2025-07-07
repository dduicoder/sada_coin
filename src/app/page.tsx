"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {status === "authenticated" && session!.user !== undefined ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">환영합니다!</CardTitle>
            <CardAction>
              <Button asChild>
                <Link href={session.user.type === "student" ? "/user" : "/club"}>
                  내 페이지
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-secondary p-4 rounded-lg">
                <div className="text-sm mb-1">이름</div>
                <div className="font-semibold">{session.user.name}</div>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <div className="text-sm mb-1">학번(ID)</div>
                <div className="font-semibold">{session.user.id}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8">
          <CardContent className="text-center">
            <CardTitle className="text-2xl mb-4">SADA 코인 시스템</CardTitle>
            <CardDescription className="mb-6">로그인하여 코인 시스템을 이용해보세요</CardDescription>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/login/user">로그인하기</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/sign-up/user">가입하기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">SADA 코인 시스템</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">
              이 코인은 경기북과학고등학교의 학생들이 개발하였으며, 2025년
              학술발표회에서 사용됩니다. 다양한 활동에 참여하고 코인을 획득하거나
              사용할 수 있습니다.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">학생용 기능</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span>•</span>
                  <span>
                    <strong>내 계좌</strong>: 잔액 조회 및 QR 코드 생성
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span>•</span>
                  <span>
                    <strong>활동 내역</strong>: 거래 히스토리 확인
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span>•</span>
                  <span>
                    <strong>랭킹</strong>: 개인 및 동아리 순위 확인
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span>•</span>
                  <span>
                    <strong>QR 코드</strong>: 부스에서 스캔하여 거래
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">동아리/부스용 기능</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span>•</span>
                  <span>
                    <strong>QR 스캐너</strong>: 학생 QR 코드 스캔
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span>•</span>
                  <span>
                    <strong>결제 처리</strong>: 코인 지급/차감 처리
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span>•</span>
                  <span>
                    <strong>활동 선택</strong>: 다양한 활동 유형 관리
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span>•</span>
                  <span>
                    <strong>거래 미리보기</strong>: 거래 전 내용 확인
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">활동 유형</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">코인 획득 (동아리 → 학생)</h4>
                <ul className="space-y-2">
                  <li>• 부스 방문 보상</li>
                  <li>• 게임 참여 보상</li>
                  <li>• 체험 활동 완료 보상</li>
                  <li>• 퀴즈 정답 보상</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">코인 사용 (학생 → 동아리)</h4>
                <ul className="space-y-2">
                  <li>• 상품 구매</li>
                  <li>• 게임 참여비</li>
                  <li>• 특별 체험 이용료</li>
                  <li>• 기념품 구매</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">사용 방법</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">학생 사용법</h4>
                <ol className="space-y-2">
                  <li>1. 학번과 개인정보로 로그인</li>
                  <li>2. 내 계좌에서 QR 코드 확인</li>
                  <li>3. 부스에서 QR 코드 제시</li>
                  <li>4. 활동 완료 후 코인 자동 적립/차감</li>
                  <li>5. 활동 내역에서 거래 기록 확인</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-3">동아리/부스 운영법</h4>
                <ol className="space-y-2">
                  <li>1. 학생의 QR 코드를 카메라로 스캔</li>
                  <li>2. 제공하는 활동 유형 선택</li>
                  <li>3. 거래 미리보기에서 정보 확인</li>
                  <li>4. "Send Payment" 버튼으로 거래 완료</li>
                  <li>5. 성공/실패 메시지 확인</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">문제 해결</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border-l-4 border-gray-300 pl-4">
                <p>
                  <strong>QR 코드가 스캔되지 않아요</strong>
                </p>
                <p>조명이 충분한 곳에서 명확하게 카메라에 비춰주세요</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <p>
                  <strong>거래가 처리되지 않아요</strong>
                </p>
                <p>네트워크 연결을 확인하고 새로고침 버튼을 눌러주세요</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <p>
                  <strong>활동 내역이 업데이트되지 않아요</strong>
                </p>
                <p>새로고침 버튼을 눌러주세요</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 text-white text-center mb-10">
          <CardContent>
            <CardTitle className="text-2xl mb-2">
              🎉 즐거운 학술발표회 되세요!
            </CardTitle>
            <p>
              SADA 코인 시스템을 통해 더욱 재미있고 활동적인 학술발표회를
              즐기세요!
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
