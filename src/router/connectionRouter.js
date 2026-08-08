const express = require('express');
const { userAuth } = require('../middlewares/auth');
const User = require('../model/User');
const ConnectioRequest = require('../model/connectionRequest');

const connectionRouter = express.Router();

connectionRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
  try {
    const fromUserId = req.loggedInUser._id;
    const { toUserId, status } = req.params;

    const allowedStatus = ['ignored', 'interested'];
    if (!allowedStatus.includes(status)) throw new Error('Invalid Status');

    const toUser = await User.findById(toUserId);
    if (!toUser) throw new Error('Invalid User');

    const existingConnectionRequest = await ConnectioRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res.status(400).json({ message: 'Connection Request Already Exists!!' });
    }

    const connectionRequest = new ConnectioRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    res.status(200).json({
      message: req.loggedInUser.firstName + ' is ' + status + ' to ' + toUser.firstName,
      data: data,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ errors: messages.join(', ') });
    }
    return res.status(500).json({ status: 500, error: error.message });
  }
});

connectionRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
  try {
    const { status, requestId } = req.params;
    const loggedInUser = req.loggedInUser;

    const allowedStatus = ['accepted', 'rejected'];
    if (!allowedStatus.includes(status)) throw new Error('Invalid Status');

    const connectionRequest = await ConnectioRequest.findOne({
      _id: requestId,
      status: 'interested',
      toUserId: loggedInUser._id,
    });

    if (!connectionRequest)
      return res.status(404).json({ message: 'Connection request not found' });

    connectionRequest.status = status;
    const data = await connectionRequest.save();

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
