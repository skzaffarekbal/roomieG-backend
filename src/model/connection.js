const mongoose = require('mongoose');

const connectionSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    status: {
      type: String,
      require: true,
      enum: {
        values: ['ignored', 'interested', 'accepted', 'rejected'],
        message: '{VALUE} is incorrect status type.',
      },
    },
  },
  { timestamps: true },
);

connectionSchema.index({ fromUserId: 1, toUserId: 1 });

connectionSchema.pre('save', function () {
  const connection = this;
  if (connection.fromUserId.equals(connection.toUserId)) {
    throw new Error("Can't send connection request to yourself");
  }
});

const Connection = mongoose.model('Connection', connectionSchema);
module.exports = Connection;
