import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  authorId?: mongoose.Types.ObjectId | string;
  authorName: string;
  content: string;
  createdAt: Date;
}

const PostSchema: Schema<IPost> = new Schema(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default PostModel;
