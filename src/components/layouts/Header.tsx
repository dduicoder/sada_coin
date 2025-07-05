"use client";

import { FC } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { logout } from "@/actions/auth";
import { useRouter } from "next/navigation";

const Header: FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <header className="fixed top-0 w-full h-16 px-[10%] flex items-center justify-between bg-white bg-opacity-50 backdrop-saturate-200 backdrop-blur-sm z-50">
      <Link href="/">
        <span className="font-bold text-2xl italic hover:underline">
          SADA COIN
        </span>
      </Link>
      <nav className="flex items-center gap-4">
        {status === "authenticated" && session!.user !== undefined ? (
          <>
            <Link href="/user">{session.user.name}님</Link>
            <Button
              onClick={async () => {
                await logout();
                router.push("/");
                router.refresh();
                window.location.reload();
              }}
            >
              로그아웃
            </Button>
          </>
        ) : (
          <Button>
            <Link href="/login">로그인</Link>
          </Button>
        )}
        {/* <ThemeSwitcher /> */}
      </nav>
    </header>
  );
};

export default Header;
