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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { clubs } from "@/constants/clubs";
import { useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  id: z.string().min(1, "동아리를 선택해 주세요."),
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
});

const ClubForm = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

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

export default ClubForm;
