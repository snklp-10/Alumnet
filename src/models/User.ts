import mongoose, { Schema, Document } from "mongoose";
// import { required } from "zod/v4-mini";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  profileImage?: string;
  createdAt: Date;
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
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid Email id"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    role: {
      type: String,
      required: [true, "Atleast one role is required"],
    },
    profileImage: {
      type: String,
      default: "", // can store URL or base64 later
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
