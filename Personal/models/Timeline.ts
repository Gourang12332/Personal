import mongoose, { Schema, Document } from "mongoose";

export interface ITimeline extends Document {
  title: string;
  date: string;
  description: string;
  image: string;
  order: number;
}

const TimelineSchema = new Schema<ITimeline>(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Timeline ||
  mongoose.model<ITimeline>("Timeline", TimelineSchema);
