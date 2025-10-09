"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { actionLoginUser } from "@/lib/server-action/auth-action";
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
import { useRouter } from "next/navigation";
import Loader from "@/components/global/loader";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../../public/Alumnet_logo.png";

// ✅ Define form validation schema
const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { username: "", email: "", password: "" },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError("");

    const response = await actionLoginUser(values);

    if (response.error) {
      setError(response.error);
      setLoading(false);
    } else {
      router.push("/home");
    }
  };

  return (
    <div className="flex justify-center items-center mt-10 md:mt-0 p-7">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 rounded-xl"
        >
          {/* App Logo / Title */}

          <Link
            href="/"
            className="w-full flex justify-center items-center space-x-2"
          >
            <Image src={Logo} alt="Alumnet Logo" width={40} height={40} />
            <span className="font-bold dark:text-white text-4xl text-center">
              Alumnet
            </span>
          </Link>

          <FormDescription className="text-foreground/60 text-center">
            Connect, share, and grow with your alumni network.
          </FormDescription>
          {/* Username Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm font-medium text-center">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full ">
            {!loading ? "Login" : <Loader />}
          </Button>
        </form>
      </Form>
    </div>
  );
}
