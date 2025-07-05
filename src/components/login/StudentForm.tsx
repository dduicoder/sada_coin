"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/actions/auth";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  id: z.string().regex(/^\d+$/, "학번은 숫자만 입력 가능합니다."),
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
});

const StudentForm = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorMessage("");
    try {
      const result = await login(values);
      console.log(result);
      if (result?.error) {
        setErrorMessage(result.error.message || "로그인에 실패했습니다.");
      } else if (result?.success) {
        // Login successful, redirect will be handled by NextAuth
        setErrorMessage("");
        router.push("/");
        window.location.reload();
      }
    } catch (error) {
      setErrorMessage("로그인 중 오류가 발생했습니다.");
    }
  }

  return (
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input placeholder="appletree" {...field} type="password" />
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
          로그인
        </Button>
      </form>
    </Form>
  );
};

export default StudentForm;
