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
import { signIn } from "@/auth";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

const clubs = [
  {
    subject: "수학",
    clubs_list: [
      { id: "limes", name: "리메스" },
      { id: "rootm", name: "루트엠" },
      { id: "laonzena", name: "라온제나" },
      { id: "naplace", name: "나플라스" },
    ],
  },

  {
    subject: "물리",
    clubs_list: [
      { id: "andamiro", name: "안다미로" },
      { id: "tips", name: "팁스" },
      { id: "neo", name: "네오" },
    ],
  },
  {
    subject: "화학",
    clubs_list: [
      { id: "chex", name: "첵스" },
      { id: "eq", name: "EQ" },
      { id: "edta", name: "에타" },
    ],
  },
  {
    subject: "생명",
    clubs_list: [
      { id: "dna", name: "DNA" },
      { id: "invitro", name: "인비트로" },
      { id: "globe", name: "글로브" },
    ],
  },
  {
    subject: "지구",
    clubs_list: [
      { id: "archi", name: "아르키" },
      { id: "pulcherrima", name: "풀체리마" },
    ],
  },
  {
    subject: "정보",
    clubs_list: [
      { id: "sada", name: "SADA" },
      { id: "next", name: "NeXT" },
    ],
  },
  {
    subject: "융합과학",
    clubs_list: [{ id: "unrevr", name: "언리버" }],
  },
];

const formSchema = z.object({
  id: z.string().min(1, "동아리를 선택해 주세요."),
  password: z.string(),
});

export default function Component() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      password: "",
    },
  });

  async function hashPassword(password: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await signIn("credentials", values);
  }

  return (
    <main>
      <Card className="mx-auto max-w-sm ">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">동아리 로그인</CardTitle>
          <CardDescription>
            동아리 이름과 비밀번호를 입력해주세요
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
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
