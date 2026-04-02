import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    author: { type: String, default: "Guest" },
    timestamp: { type: String, default: () => new Date().toISOString() },
    type: { type: String, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: {
      type: [
        new mongoose.Schema(
          {
            text: { type: String, required: true },
            author: { type: String, default: "Guest" },
            timestamp: { type: String, default: () => new Date().toISOString() }
          },
          { _id: false }
        )
      ],
      default: []
    }
  },
  { versionKey: false }
);

export default mongoose.model("Post", postSchema);
