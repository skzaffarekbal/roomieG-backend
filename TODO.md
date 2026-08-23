# Have to Work on this section

- Logic for request: if both send interest then connect else no connection ✅
- Also logic for feed API ✅
- Daily Limit Reach Logic ✅

- Add all db detail for roomieG user.
- implement swagger

- Scheduling Cron Jobs
- Amazon SES
- Image upload using s3 or cloudinary.

- Admin user routes and functionality

- have to implement Typing concept

```
    socket.on('typing', async ({ loginUserId, targetUserId }) => {
      const isAllowed = await checkChatAccess(loginUserId, targetUserId);
      if (!isAllowed) return;

      const roomId = getSecretRoomId(loginUserId, targetUserId);
      io.to(roomId).emit('userTyping', { loginUserId, targetUserId, roomId });
    });

    socket.on('typingStopped', async ({ loginUserId, targetUserId }) => {
      const isAllowed = await checkChatAccess(loginUserId, targetUserId);
      if (!isAllowed) return;

      const roomId = getSecretRoomId(loginUserId, targetUserId);
      io.to(roomId).emit('userTypingStopped', { loginUserId, targetUserId, roomId });
    });
```
