"use server";
import { FormSchema, signUpSchema } from "../validations/schemas";
import bcrypt from "bcryptjs";
import dbConnect from "../dbConfig/db";
import UserModel from "@/models/User";
import { z } from "zod";

// Login User
export async function actionLoginUser({
  email,
  password,
}: z.infer<typeof FormSchema>) {
  await dbConnect();

  const user = await UserModel.findOne({ email });
  if (!user) return { error: "Invalid email or password" };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return { error: "Invalid email or password" };

  // Just return user info (or a success message)
  return {
    success: "Login successful",
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
  };
}

// Sign Up User
export async function actionSignUpUser({
  username,
  email,
  password,
  role,
}: z.infer<typeof signUpSchema>) {
  await dbConnect();

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) return { error: "User already exists" };

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({
    username,
    email,
    password: hashedPassword,
    role: role, // default role
    createdAt: new Date(),
  });

  await newUser.save();

  // Just return new user info
  return {
    success: "Registration successful",
    user: {
      id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
    },
  };
}
