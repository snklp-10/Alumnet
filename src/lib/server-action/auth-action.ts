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
      id: user._id.toString(),
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
    role,
    // Initialize all optional fields with default values
    profileImage: "",
    bio: "",
    // Alumni fields
    graduation_year: null,
    degree: "",
    current_company: "",
    job_title: "",
    // Student fields
    enrollment_year: null,
    current_year: null,
    major: "",
    createdAt: new Date(),
  });

  await newUser.save();

  // Return new user info with all fields
  return {
    success: "Registration successful",
    user: {
      id: newUser._id.toString(),
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
      profileImage: newUser.profileImage,
      bio: newUser.bio,
      graduation_year: newUser.graduation_year,
      degree: newUser.degree,
      current_company: newUser.current_company,
      job_title: newUser.job_title,
      enrollment_year: newUser.enrollment_year,
      current_year: newUser.current_year,
      major: newUser.major,
    },
  };
}

// Get User Info
export async function getUserInfo(userId: string) {
  try {
    await dbConnect();
    const user = await UserModel.findById(userId).select("-password"); // Exclude password
    
    if (!user) {
      return { error: "User not found" };
    }

    return {
      success: "User found",
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        graduation_year: user.graduation_year,
        degree: user.degree,
        current_company: user.current_company,
        job_title: user.job_title,
        enrollment_year: user.enrollment_year,
        current_year: user.current_year,
        major: user.major,
      }
    };
  } catch (error) {
    return { error: "Failed to fetch user" };
  }
}

// Update User Info
export async function updateUserInfo(
  userId: string,
  updateData: {
    username?: string;
    email?: string;
    profileImage?: string;
    bio?: string;
    graduation_year?: number | null;
    degree?: string;
    current_company?: string;
    job_title?: string;
    enrollment_year?: number | null;
    current_year?: number | null;
    major?: string;
  }
) {
  try {
    await dbConnect();
    
    // Check if email is being updated and if it's already taken
    if (updateData.email) {
      const existingUser = await UserModel.findOne({ 
        email: updateData.email,
        _id: { $ne: userId } // exclude current user
      });
      if (existingUser) {
        return { error: "Email already in use" };
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return { error: "User not found" };
    }

    return {
      success: "User updated successfully",
      user: {
        id: updatedUser._id.toString(),
        email: updatedUser.email,
        username: updatedUser.username,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        bio: updatedUser.bio,
        graduation_year: updatedUser.graduation_year,
        degree: updatedUser.degree,
        current_company: updatedUser.current_company,
        job_title: updatedUser.job_title,
        enrollment_year: updatedUser.enrollment_year,
        current_year: updatedUser.current_year,
        major: updatedUser.major,
      }
    };
  } catch (error) {
    return { error: "Failed to update user" };
  }
}
