import mongoose, { Schema, Document } from "mongoose";

export interface IMemory extends Document {
  image: string;
  caption: string;
  date: string;
  category: string;
}

const MemorySchema = new Schema<IMemory>(
  {
    image: { type: String, required: true },
    caption: { type: String, required: true },
    date: { type: String, required: true },
    category: { type: String, required: true }, // e.g. "Trips", "Dates", "Goofy"
  },
  { timestamps: true }
);

export default mongoose.models.Memory ||
  mongoose.model<IMemory>("Memory", MemorySchema);
