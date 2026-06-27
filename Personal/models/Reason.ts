import mongoose, { Schema, Document } from "mongoose";

export interface IReason extends Document {
  title: string;
  description: string;
  icon: string;
  order: number;
}

const ReasonSchema = new Schema<IReason>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }, // e.g. "Heart", "Smile", "Flame"
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Reason ||
  mongoose.model<IReason>("Reason", ReasonSchema);
