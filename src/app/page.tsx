"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main>
      {status === "authenticated" && session!.user !== undefined ? (
        <div>
          <p>안녕하세요, {session.user.name}님!</p>
          <p>당신의 학번은 {session.user.id}입니다.</p>
          <p>당신의 해시는 {session.user.hash}입니다.</p>
        </div>
      ) : (
        <div>
          <p>로그인하지 않았습니다.</p>
          <p>
            <Link href="/user/login" className="text-blue-400">
              로그인하기
            </Link>
          </p>
        </div>
      )}
      <p>
        계정이 없다면?{" "}
        <Link href="/sign-up" className="text-blue-400">
          가입하기
        </Link>
      </p>
      <p>
        이 코인은 경기북과학고등학교의 학생들이 개발하였으며, 행사에 참여하는
        모든 학생들에게 배포됩니다. 이 코인을 사용하여 행사에 참여하고, 다양한
        활동에 참여할 수 있습니다.
      </p>
    </main>
  );
}
