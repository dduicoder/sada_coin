"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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

const formSchema = z.object({
  id: z
    .string()
    .min(4, "학번은 네 자리만 가능합니다.")
    .max(4, "학번은 네 자리만 가능합니다.")
    .regex(/^\d+$/, "학번은 숫자만 입력 가능합니다."),
  name: z
    .string()
    .min(2, "이름은 최소 두 글자입니다.")
    .max(50, "이름은 최대 50글자입니다."),
  password: z
    .string()
    .min(6, "비밀번호는 최소 여섯 글자입니다.")
    .max(50, "비밀번호는 최대 50글자입니다."),
  club_id: z.string().min(1, "동아리를 선택해주세요"),
});

export default function Component() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      password: "",
      club_id: "",
    },
  });


  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    fetch("http://127.0.0.1:5000/users", {
      method: "POST",
      headers: {
        // fix cors
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: values.id,
        name: values.name,
        password: await hashPassword(values.password),
        club_id: values.club_id,
      }),
    }).then((response) => {
      if (response.ok) {
        alert("가입이 완료되었습니다!");
        form.reset();
      } else {
        alert("가입에 실패했습니다. 다시 시도해주세요.");
      }
    });
  }

  return (
    <main>
      <Card className="mx-auto max-w-sm ">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">학생 등록</CardTitle>
          <CardDescription>
            학번과 이름, 비밀번호와 동아리를 입력해주세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>학번</FormLabel>
                    <FormControl>
                      <Input placeholder="2601" {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input placeholder="뉴턴" {...field} type="text" />
                    </FormControl>
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
                name="club_id"
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
                    <FormDescription>
                      전체 동아리 인원을 파악하기 어려워 개인에게 입력을 받고
                      있습니다. 혼동이 생기지 않도록 정확하게 입력해 주세요!
                    </FormDescription>
                  </FormItem>
                )}
              />

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
