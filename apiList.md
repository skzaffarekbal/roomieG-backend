# Roomie APIs List

## authRouter

- POST /signup ✅
- POST /login ✅
- POST /logout ✅

## profileRouter

- GET /profile/view ✅
- PATCH /profile/edit ✅
- PATCH /profile/password ✅

## connectionRouter

POST /request/send/:status/:userId ✅

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId

POST /request/review/:status/:requestId ✅

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter

- GET /user/request/received ✅
- GET /user/connections ✅
- GET /user/feed ✅
- GET /user/:targetId ✅
- GET /user/unread-chats-count ✅

Status: ignored, interested, accepted, rejected
