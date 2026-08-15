const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const app = express();

const corsOptions = {
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./router/authRouter');
const profileRouter = require('./router/profileRouter');
const connectionRouter = require('./router/connectionRouter');
const userRouter = require('./router/userRouter');

app.get('/', (req, res) => {
  res.send('Welcome to API of RoomieG');
});

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', connectionRouter);
app.use('/', userRouter);

connectDB()
  .then(() => {
    console.log('Database connection established...');

    const PORT = process.env.PORT || 7777;
    const HOST = process.env.HOST || '127.0.0.1';

    app.listen(PORT, HOST, () => console.log(`Server Running at http://${HOST}:${PORT}`));
  })
  .catch((err) => {
    console.error("Database can't connect : ", err.message);
  });
