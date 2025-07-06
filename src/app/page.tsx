"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {status === "authenticated" && session!.user !== undefined ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">환영합니다!</h1>
            <div className="flex gap-3">
              <Link
                href={session.user.type === "student" ? "/user" : "/club"}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                내 페이지
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">이름</div>
              <div className="font-semibold text-gray-900">
                {session.user.name}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">학번(ID)</div>
              <div className="font-semibold text-gray-900">
                {session.user.id}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              SADA 코인 시스템
            </h1>
            <p className="text-gray-600 mb-6">
              로그인하여 코인 시스템을 이용해보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/login/user">
                <Button>로그인하기</Button>
              </Link>
              <Link href="/sign-up/user">
                <Button variant={"outline"}>가입하기</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            SADA 코인 시스템
          </h2>
          <p className="text-gray-600 leading-relaxed">
            이 코인은 경기북과학고등학교의 학생들이 개발하였으며, 2025년
            학술발표회에서 사용됩니다. 다양한 활동에 참여하고 코인을 획득하거나
            사용할 수 있습니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              학생용 기능
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-gray-400">•</span>
                <span>
                  <strong className="text-gray-900">내 계좌</strong>: 잔액 조회
                  및 QR 코드 생성
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400">•</span>
                <span>
                  <strong className="text-gray-900">활동 내역</strong>: 거래
                  히스토리 확인
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400">•</span>
                <span>
                  <strong className="text-gray-900">랭킹</strong>: 개인 및
                  동아리 순위 확인
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400">•</span>
                <span>
                  <strong className="text-gray-900">QR 코드</strong>: 부스에서
                  스캔하여 거래
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              동아리/부스용 기능
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-gray-400">•</span>
                <span>
                  <strong className="text-gray-900">QR 스캐너</strong>: 학생 QR
                  코드 스캔
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400">•</span>
                <span>
                  <strong className="text-gray-900">결제 처리</strong>: 코인
                  지급/차감 처리
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400">•</span>
                <span>
                  <strong className="text-gray-900">활동 선택</strong>: 다양한
                  활동 유형 관리
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400">•</span>
                <span>
                  <strong className="text-gray-900">거래 미리보기</strong>: 거래
                  전 내용 확인
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">활동 유형</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                코인 획득 (동아리 → 학생)
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li>• 부스 방문 보상</li>
                <li>• 게임 참여 보상</li>
                <li>• 체험 활동 완료 보상</li>
                <li>• 퀴즈 정답 보상</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                코인 사용 (학생 → 동아리)
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li>• 상품 구매</li>
                <li>• 게임 참여비</li>
                <li>• 특별 체험 이용료</li>
                <li>• 기념품 구매</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">사용 방법</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">학생 사용법</h4>
              <ol className="space-y-2 text-gray-600">
                <li>1. 학번과 개인정보로 로그인</li>
                <li>2. 내 계좌에서 QR 코드 확인</li>
                <li>3. 부스에서 QR 코드 제시</li>
                <li>4. 활동 완료 후 코인 자동 적립/차감</li>
                <li>5. 활동 내역에서 거래 기록 확인</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                동아리/부스 운영법
              </h4>
              <ol className="space-y-2 text-gray-600">
                <li>1. 학생의 QR 코드를 카메라로 스캔</li>
                <li>2. 제공하는 활동 유형 선택</li>
                <li>3. 거래 미리보기에서 정보 확인</li>
                <li>4. "Send Payment" 버튼으로 거래 완료</li>
                <li>5. 성공/실패 메시지 확인</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">문제 해결</h3>
          <div className="space-y-3 text-gray-600">
            <div className="border-l-4 border-gray-300 pl-4">
              <p>
                <strong className="text-gray-900">
                  QR 코드가 스캔되지 않아요
                </strong>
              </p>
              <p>조명이 충분한 곳에서 명확하게 카메라에 비춰주세요</p>
            </div>
            <div className="border-l-4 border-gray-300 pl-4">
              <p>
                <strong className="text-gray-900">
                  거래가 처리되지 않아요
                </strong>
              </p>
              <p>네트워크 연결을 확인하고 새로고침 버튼을 눌러주세요</p>
            </div>
            <div className="border-l-4 border-gray-300 pl-4">
              <p>
                <strong className="text-gray-900">
                  활동 내역이 업데이트되지 않아요
                </strong>
              </p>
              <p>새로고침 버튼을 눌러주세요</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 text-white p-6 rounded-lg text-center mb-10">
          <h3 className="text-2xl font-bold mb-2">
            🎉 즐거운 학술발표회 되세요!
          </h3>
          <p className="text-gray-300">
            SADA 코인 시스템을 통해 더욱 재미있고 활동적인 학술발표회를
            즐기세요!
          </p>
        </div>
      </div>
    </main>
  );
}
