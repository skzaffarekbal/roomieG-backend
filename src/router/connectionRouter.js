const express = require('express');
const { userAuth } = require('../middlewares/auth');
const User = require('../model/user');
const Connection = require('../model/connection');
const { dailySwipeLimit } = require('../middlewares/dailySwipeLimit');

const connectionRouter = express.Router();

connectionRouter.post(
  '/request/send/:status/:toUserId',
  userAuth,
  dailySwipeLimit,
  async (req, res) => {
    try {
      const fromUserId = req.loggedInUser._id;
      const { toUserId, status } = req.params;

      const allowedStatus = ['ignored', 'interested'];
      if (!allowedStatus.includes(status)) throw new Error('Invalid Status');

      if (fromUserId.toString() === toUserId.toString()) {
        return res.status(400).json({ error: 'Self-interaction is forbidden.' });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) throw new Error('The profile you are trying to swipe on does not exist.');

      const existingConnection = await Connection.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnection) {
        if (existingConnection.status === 'accepted') {
          return res.status(400).json({
            message: 'You are already matched with this user. Modification denied.',
          });
        }
        if (existingConnection.fromUserId.toString() === fromUserId) {
          return res.status(400).json({
            message: 'You have already swiped on this profile earlier.',
          });
        }
      }

      // 1. Try to find if the target user has an active interest record pointing to us
      if (status === 'interested') {
        const mutualMatch = await Connection.findOneAndUpdate(
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
            status: 'interested',
          },
          { $set: { status: 'accepted' } },
          { new: true },
        );

        if (mutualMatch) {
          return res.status(200).json({
            message: "It's a match!",
            status: 'accepted',
          });
        }
      }

      // 2. Safe standalone record execution via Upsert
      const savedAction = await Connection.findOneAndUpdate(
        { fromUserId: fromUserId, toUserId: toUserId },
        { $set: { status } },
        { upsert: true, new: true },
      );

      return res.status(200).json({
        message: 'Swipe recorded successfully.',
        status: savedAction.status,
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ errors: messages.join(', ') });
      }
      return res.status(500).json({ status: 500, error: error.message });
    }
  },
);

connectionRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
  try {
    const { status, requestId } = req.params;
    const loggedInUser = req.loggedInUser;

    const allowedStatus = ['accepted', 'rejected'];
    if (!allowedStatus.includes(status)) throw new Error('Invalid Status');

    const connection = await Connection.findOne({
      _id: requestId,
      status: 'interested',
      toUserId: loggedInUser._id,
    });

    if (!connection) return res.status(404).json({ message: 'Connection request not found' });

    connection.status = status;
    const data = await connection.save();

    res.status(200).json({ message: 'Connection request ' + status, data });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ errors: messages.join(', ') });
    }
    return res.status(500).json({ status: 500, error: error.message });
  }
});

module.exports = connectionRouter;
