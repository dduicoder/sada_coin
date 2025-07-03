"use client";

import { FC } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { signOut } from "@/auth";
import { logout } from "@/actions/auth";

const Header: FC = () => {
  const pathname = usePathname();

  const { data: session, status } = useSession();

  // No longer needed as we'll apply active styles directly with Tailwind's 'active' variant or conditional classes
  // const getAnchorClassName = (link: string) => {
  //   return pathname!.startsWith(`/${link}`) ? classes.active : "";
  // };
  const router = usePathname();

  return (
    <header className="fixed top-0 w-full h-16 px-[10%] flex items-center justify-between bg-white bg-opacity-50 backdrop-saturate-200 backdrop-blur-sm z-50">
      <Link href="/">
        {/* <FontAwesomeIcon icon={faInbox} /> */}
        {/* <Image src="/logo.png" width="32" height="32" alt="" /> */}
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
              }}
            >
              로그아웃
            </Button>
          </>
        ) : (
          <Button>
            <Link href="/login" className="text-blue-400">
              로그인
            </Link>
          </Button>
        )}
        {/* <ThemeSwitcher /> */}
      </nav>
    </header>
  );
};

export default Header;
