import mongoose, { Schema, Document } from "mongoose";

export interface IVideo extends Document {
  title: string;
  videoUrl: string;
  description: string;
}

const VideoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Video ||
  mongoose.model<IVideo>("Video", VideoSchema);
