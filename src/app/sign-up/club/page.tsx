"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { clubs, getClubNameById } from "@/constants/clubs";
import { hashPassword } from "@/lib/auth-utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

const formSchema = z
  .object({
    id: z.string().min(1, "동아리를 선택해주세요"),
    password: z
      .string()
      .min(6, "비밀번호는 최소 여섯 글자입니다.")
      .max(50, "비밀번호는 최대 50글자입니다."),
    password_check: z
      .string()
      .min(6, "비밀번호는 최소 여섯 글자입니다.")
      .max(50, "비밀번호는 최대 50글자입니다."),
  })
  .refine((data) => data.password === data.password_check, {
    message: "비밀번호가 맞지 않아요.",
    path: ["password_check"],
  });

export default function ClubSignUpPage() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      password: "",
      password_check: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const id = values.id;
    const name = getClubNameById(id);
    const password = await hashPassword(values.password);

    setErrorMessage("");

    if (!name) {
      setErrorMessage("동아리를 찾을 수 없습니다.");
      return;
    }

    try {
      fetch("/api/sign-up/clubs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          password,
        }),
      }).then(async (response) => {
        if (response.ok) {
          signIn("credentials", {
            id,
            password,
            redirectTo: "/",
          });
        } else {
          setErrorMessage("가입에 실패했습니다. 다시 시도해주세요.");
        }
      });
    } catch (error) {
      console.log("error");
    }
  }

  return (
    <main>
      <Card className="mx-auto max-w-sm ">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">동아리 등록</CardTitle>
          <CardDescription>
            <div>동아리와 동아리 계정 공용 비밀번호를 입력해주세요</div>
            <div>
              계정이 있다면?{" "}
              <Link href="../login/club" className="text-blue-400">
                로그인하기
              </Link>
            </div>
          </CardDescription>
          <CardAction>
            <Link href="/sign-up/user">
              <Button
                variant="secondary"
                size="icon"
                className="size-full px-3 py-2"
              >
                학생 회원가입
                <ChevronRight className="ml-2 size-4" />
              </Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>동아리</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      {...field}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="영국왕립학회" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clubs.map((item) => (
                          <SelectGroup key={item.subject}>
                            <SelectLabel>{item.subject}</SelectLabel>
                            {item.clubs_list.map((club) => (
                              <SelectItem
                                key={club.id}
                                value={club.id}
                                className="cursor-pointer"
                              >
                                <Image
                                  src={`/clubs/${club.id}.png`}
                                  alt={club.name}
                                  width={16}
                                  height={16}
                                  className="inline-block mr-2"
                                />
                                {club.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="appletree"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      잊어버리지 않도록 주의해주세요!
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password_check"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호 확인</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="appletree"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {errorMessage && (
                <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
                  {errorMessage}
                </div>
              )}
              <Button type="submit" className="w-full">
                등록
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
