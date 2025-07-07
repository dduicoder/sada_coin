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
import { Button } from "../ui/button";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { hashPassword } from "@/lib/auth-utils";
import { AuthError } from "next-auth";
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
      const res = await signIn("credentials", {
        id: values.id,
        password: await hashPassword(values.password),
        redirect: false,
      });

      if (res?.error === "CredentialsSignin") {
        console.log(res.error);
        setErrorMessage("학번 또는 비밀번호가 일치하지 않습니다.");
        return;
      }

      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        router.replace("/");
      }
    } catch (error) {
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        throw error;
      }

      if (error instanceof AuthError) {
        console.error("AuthError:", error);
      }

      throw error;
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
