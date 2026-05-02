import mongoose, { Schema, model, models } from 'mongoose';

export interface IPost {
  _id: string;
  user: {
    name: string;
    avatar: string;
    clerkId: string;
  };
  image: string;
  caption: string;
  likes: number;
  tags: string[];
  createdAt: Date;
}

const PostSchema = new Schema<IPost>({
  user: {
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    clerkId: { type: String, required: true },
  },
  image: { type: String, required: true },
  caption: { type: String, required: true },
  likes: { type: Number, default: 0 },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const Post = models.Post || model('Post', PostSchema);

export default Post;
