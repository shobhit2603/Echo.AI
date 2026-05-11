import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  isPinned: {
    type: Boolean,
    default: false,
  },
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
