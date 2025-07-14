"use client";

import { useSession } from "next-auth/react";
import Balance from "@/components/user/Balance";
import Link from "next/link";

const UserPage = () => {
  const { data: session, status } = useSession();

  if (status !== "authenticated" || !session.user) {
    return <main>접근이 허용되지 않았습니다.</main>;
  }

  const user = session.user;

  if (user.type !== "student") {
    return <main>학생만 접근할 수 있습니다.</main>;
  }

  return (
    <main>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">
            {user.id} {user.name} 님
          </h1>
          <p>
            SADA에서 개발한 코인을 이용해 2025년 학술발표회를 즐겨보세요!
            <br></br>어떤 활동을 할 지 모르시겠다면?{" "}
            <Link className="text-blue-400" href={"/activities"}>
              동아리별 활동 보러 가기
            </Link>
          </p>
        </div>

        <Balance user={user} />
      </div>
    </main>
  );
};

export default UserPage;
