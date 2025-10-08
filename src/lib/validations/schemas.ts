import { z } from "zod";

// Signup
export const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["student", "alumni", "admin"]).optional(),
});

// Login
export const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const FormSchema = z.object({
  username: z.string().min(3, "Useranme must at least 3 characters long"),
  email: z.string().describe("Email").email({ message: "Invalid Email" }),
  password: z.string().describe("Password").min(3, "Password is required"),
});
