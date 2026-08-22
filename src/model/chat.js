const mongoose = require('mongoose');

const chatSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: { type: String, required: true },
    roomId: { type: String, required: true },
    seen: { type: Boolean, default: false },
    seenAt: { type: Date },
  },
  { timestamps: true },
);

chatSchema.index({ roomId: 1, timestamp: -1 });

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
