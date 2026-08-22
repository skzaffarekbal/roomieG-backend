const socket = require('socket.io');
const crypto = require('node:crypto');
const Chat = require('../model/chat');

const getSecretRoomId = ({ loginUserId, targetUserId }) => {
  return crypto
    .createHash('sha256')
    .update([loginUserId, targetUserId].sort().join('_'))
    .digest('hex');
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: 'http://localhost:5173',
    },
  });

  io.on('connection', (socket) => {
    socket.on('joinChat', async ({ loginUserId, targetUserId }) => {
      let roomId = getSecretRoomId(loginUserId, targetUserId);
      socket.join(roomId);

      try {
        const chatHistory = await Chat.find({ roomId }).sort({ createdAt: 1 }).limit(50);
        socket.emit('chatHistory', chatHistory);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('sendMessage', async (data) => {
      let { loginUserId, targetUserId, text } = data;
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

    socket.on('disconnect', () => {});
  });
};

module.exports = initializeSocket;
