import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [String], // ["user1", "user2"]
      required: true,
    },
    lastMessage: {
      text: { type: String },
      sender: { type: String },
      createdAt: { type: Date },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", ConversationSchema);
