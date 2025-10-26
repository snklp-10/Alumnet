"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { actionSignUpUser } from "@/lib/server-action/auth-action";
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
import Link from "next/link";
import Loader from "@/components/global/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Logo from "../../../../public/Alumnet_logo.png";

// Signup validation schema
const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z
    .enum(["student", "alumni", "admin"])
    .optional()
    .or(z.literal("student")),
});

type SignUpFormValues = z.infer<typeof schema>;

export default function SignUpPage() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "student",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (values: SignUpFormValues) => {
    setLoading(true);
    setError("");

    const response = await actionSignUpUser(values);
    setLoading(false);

   if (response.error) {
    setError(response.error);
    form.reset();
  } else {
    const user = response.user;

    // Check if user needs profile setup
    if (!user?.bio && !user?.profileImage) {
      // Redirect to setup page for new users
      router.push(`/register?userId=${user?.id}`);
    } else {
      // Redirect existing users to dashboard
      router.push("/dashboard");
    }
  }
  };

  return (
    <div className="flex justify-center items-center mt-10 md:mt-0">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 p-8 rounded-xl"
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
                  <Input placeholder="Enter your username" {...field} />
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

          {/* Role Field */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="alumni">Alumni</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Error Message */}
          {error && <FormMessage>{error}</FormMessage>}

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full">
            {!loading ? "Sign Up" : <Loader />}
          </Button>
        </form>
      </Form>
    </div>
  );
}
