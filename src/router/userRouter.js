const express = require('express');
const { userAuth } = require('../middlewares/auth');
const Connection = require('../model/connection');
const User = require('../model/user');
const Chat = require('../model/chat');

const userRouter = express.Router();
const USER_POPULATE = 'firstName lastName photoUrl gender age about createdAt';

userRouter.get('/user/request/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.loggedInUser;

    const allRequest = await Connection.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', USER_POPULATE);

    res.status(200).json({ data: allRequest, message: 'All Request' });
  } catch (error) {
    return res.status(500).json({ status: 500, error: error.message });
  }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.loggedInUser;

    const allConnectionRaw = await Connection.find({
      $or: [
        { fromUserId: loggedInUser._id, status: 'accepted' },
        { toUserId: loggedInUser._id, status: 'accepted' },
      ],
    }).populate('fromUserId toUserId', USER_POPULATE);

    const allConnection = allConnectionRaw.map((connect) => {
      if (connect.fromUserId._id.toString() === loggedInUser._id.toString())
        return connect.toUserId;
      else return connect.fromUserId;
    });

    res.status(200).json({ data: allConnection, message: 'All Connection' });
  } catch (error) {
    return res.status(500).json({ status: 500, error: error.message });
  }
});

userRouter.get('/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.loggedInUser;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 5;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const allConnection = await Connection.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id, status: 'accepted' }],
    }).select('fromUserId toUserId');

    const hideUserFromFeed = new Set();
    hideUserFromFeed.add(loggedInUser._id);
    allConnection.forEach((connect) => {
      if (connect.fromUserId.toString() === loggedInUser._id.toString()) {
        hideUserFromFeed.add(connect.toUserId);
      } else {
        hideUserFromFeed.add(connect.fromUserId);
      }
    });

    const feedUserList = await User.find({
      _id: { $nin: Array.from(hideUserFromFeed) },
    })
      .select(USER_POPULATE)
      .skip(skip)
      .limit(limit);

    res.status(200).json({ data: feedUserList, message: 'Feed Data' });
  } catch (error) {
    return res.status(500).json({ status: 500, error: error.message });
  }
});

userRouter.get('/user/profile/:targetId', userAuth, async (req, res) => {
  try {
    const { targetId } = req.params;

    const targetUser = await User.findById(targetId).select(USER_POPULATE);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ data: targetUser, message: 'User Data' });
  } catch (error) {
    return res.status(500).json({ status: 500, error: error.message });
  }
});

userRouter.get('/user/unread-chats-count', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.loggedInUser;

    const unreadCounts = await Chat.aggregate([
      { $match: { receiverId: loggedInUser._id, seen: false } },
      { $group: { _id: '$senderId', count: { $sum: 1 } } },
    ]);

    const userWiseUnreadCounts = {};
    let totalUnreadCount = 0;
    unreadCounts.forEach((chat) => {
      userWiseUnreadCounts[chat._id.toString()] = chat.count;
      totalUnreadCount += chat.count;
    });

    res.status(200).json({
      data: { userWiseUnreadCounts, totalUnreadCount },
      message: 'Unread Chats Count',
    });
  } catch (error) {
    return res.status(500).json({ status: 500, error: error.message });
  }
});

module.exports = userRouter;
