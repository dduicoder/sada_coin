"use client";

import { FC } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const Header: FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setTheme } = useTheme();

  return (
    <header className="fixed top-0 w-full h-16 px-4 flex items-center justify-between bg-opacity-50 backdrop-saturate-200 backdrop-blur-sm z-50">
      <Link href="/">
        <span className="font-bold text-2xl italic hover:underline">
          GBS COIN
        </span>
      </Link>
      <nav className="flex items-center gap-4">
        {status === "authenticated" && session!.user !== undefined ? (
          <>
            <Link href={session.user.type === "student" ? "/user" : "/club"}>
              {session.user.name}님
            </Link>
            <Button
              onClick={() => {
                signOut({ redirect: false });
                router.replace("/");
              }}
            >
              로그아웃
            </Button>
          </>
        ) : (
          <Link href="/login/user">
            <Button>로그인</Button>
          </Link>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun />
              밝음
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon />
              어두움
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Settings />
              시스템 설정
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
};

export default Header;
