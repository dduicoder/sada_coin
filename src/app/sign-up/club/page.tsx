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
  id: z.string().min(1, "동아리를 선택해주세요"),
  password: z
    .string()
    .min(6, "비밀번호는 최소 여섯 글자입니다.")
    .max(50, "비밀번호는 최대 50글자입니다."),
});

export default function Component() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const id = values.id;
    const password = values.password;
    const name = getClubNameById(id);

    if (!name) {
      alert("동아리를 찾을 수 없습니다.");
      return;
    }

    fetch("http://127.0.0.1:5000/clubs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        name,
        password: await hashPassword(password),
      }),
    }).then(async (response) => {
      if (response.ok) {
        alert("가입이 완료되었습니다!");
        form.reset();
      } else {
        console.log(await response.json());
      }
    });
  }

  return (
    <main>
      <Card className="mx-auto max-w-sm ">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">동아리 등록</CardTitle>
          <CardDescription>
            동아리와 동아리 계정 공용 비밀번호를 입력해주세요
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
