const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectioRequest = require('../model/connectionRequest');
const User = require('../model/user');

const userRouter = express.Router();
const USER_POPULATE = 'firstName lastName photoUrl gender age about createdAt';

userRouter.get('/user/request/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.loggedInUser;

    const allRequest = await ConnectioRequest.find({
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

    const allConnectionRaw = await ConnectioRequest.find({
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

    const allConnection = await ConnectioRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select('fromUserId toUserId');

    const hideUserFromFeed = new Set();
    allConnection.forEach((connect) => {
      hideUserFromFeed.add(connect.fromUserId);
      hideUserFromFeed.add(connect.toUserId);
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

userRouter.get('/user/:targetId', userAuth, async (req, res) => {
  try {
    const { targetId } = req.params;

    const targetUser = await User.findById(targetId).select(USER_POPULATE);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ data: targetUser, message: 'User Data' });
  } catch (error) {
    return res.status(500).json({ status: 500, error: error.message });
  }
});

module.exports = userRouter;
