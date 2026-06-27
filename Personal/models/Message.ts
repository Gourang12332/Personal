import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  title: string;
  content: string;
  order: number;
}

const MessageSchema = new Schema<IMessage>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Message ||
  mongoose.model<IMessage>("Message", MessageSchema);
