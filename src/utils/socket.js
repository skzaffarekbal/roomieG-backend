const socket = require('socket.io');
const crypto = require('node:crypto');
const Chat = require('../model/chat');
const jwt = require('jsonwebtoken');
const ConnectionRequest = require('../model/connectionRequest');

const getSecretRoomId = (loginUserId, targetUserId) => {
  return crypto
    .createHash('sha256')
    .update([loginUserId, targetUserId].sort().join('_'))
    .digest('hex');
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    const checkChatAccess = async (loginUserId, targetUserId) => {
      try {
        const cookies = socket.request.headers.cookie || '';
        const tokenCookie = cookies.split('; ').find((row) => row.startsWith('token='));
        if (!tokenCookie) throw new Error('Authentication token missing');

        const token = tokenCookie.split('=')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded._id !== loginUserId) throw new Error('Unauthorized user');

        const connection = await ConnectionRequest.findOne({
          $or: [
            { fromUserId: loginUserId, toUserId: targetUserId, status: 'accepted' },
            { fromUserId: targetUserId, toUserId: loginUserId, status: 'accepted' },
          ],
        });

        if (!connection) throw new Error('No accepted connection found');

        return true;
      } catch (error) {
        console.error('Chat access denied:', error.message);
        return false;
      }
    };

    socket.on('joinChat', async ({ loginUserId, targetUserId }) => {
      const isAllowed = await checkChatAccess(loginUserId, targetUserId);
      if (!isAllowed) {
        socket.emit('chatError', 'Could not join chat.');
        return;
      }

      let roomId = getSecretRoomId(loginUserId, targetUserId);
      socket.join(roomId);

      try {
        const chatHistory = await Chat.find({ roomId }).sort({ createdAt: -1 }).limit(20);
        socket.emit('chatHistory', chatHistory.reverse());
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('sendMessage', async (data) => {
      let { loginUserId, targetUserId, text } = data;
      const isAllowed = await checkChatAccess(loginUserId, targetUserId);
      if (!isAllowed) {
        socket.emit('chatError', 'Could not join chat.');
        return;
      }

      let roomId = getSecretRoomId(loginUserId, targetUserId);
      try {
        const newMessage = new Chat({
          senderId: loginUserId,
          receiverId: targetUserId,
          text,
          roomId,
        });
        await newMessage.save();
        io.to(roomId).emit('receivedMessage', newMessage);
      } catch (error) {
        console.error(err);
      }
    });

    socket.on('markAsSeen', async ({ loginUserId, targetUserId }) => {
      const isAllowed = await checkChatAccess(loginUserId, targetUserId);
      if (!isAllowed) {
        socket.emit('chatError', 'Could not join chat.');
        return;
      }

      let roomId = getSecretRoomId(loginUserId, targetUserId);
      try {
        await Chat.updateMany(
          { roomId, receiverId: loginUserId, seen: false },
          { $set: { seen: true, seenAt: new Date() } },
        );
        io.to(roomId).emit('messagesSeen', { roomId, seenBy: loginUserId });
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('fetchOldMessages', async ({ loginUserId, targetUserId, skip }) => {
      const isAllowed = await checkChatAccess(loginUserId, targetUserId);
      if (!isAllowed) return;

      let roomId = getSecretRoomId(loginUserId, targetUserId);
      try {
        const olderMessages = await Chat.find({ roomId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(20);
        socket.emit('olderMessages', olderMessages.reverse());
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('disconnect', () => {});
  });
};

module.exports = initializeSocket;
