import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "student" | "alumni" | "admin"; // restricts possible roles
  profileImage?: string;
  bio?: string;
  followers?: Array<mongoose.Types.ObjectId | string>;
  following?: Array<mongoose.Types.ObjectId | string>;

  // Alumni fields
  graduation_year?: number;
  degree?: string;
  current_company?: string;
  job_title?: string;

  // Student fields
  enrollment_year?: number;
  current_year?: number;
  major?: string;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["student", "alumni", "admin"],
      required: [true, "Role is required"],
    },
    profileImage: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },

    // Alumni-specific fields
    graduation_year: {
      type: Number,
      default: null,
    },
    degree: {
      type: String,
      default: "",
    },
    current_company: {
      type: String,
      default: "",
    },
    job_title: {
      type: String,
      default: "",
    },

    // Student-specific fields
    enrollment_year: {
      type: Number,
      default: null,
    },
    current_year: {
      type: Number,
      default: null,
    },
    major: {
      type: String,
      default: "",
    },

    // Social
    followers: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    following: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
