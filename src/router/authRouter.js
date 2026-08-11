const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../model/user');
const { validateSignUpData } = require('../utils/validation');

const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, password, emailId } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();

    const token = await savedUser.getJWT();
    res.cookie('token', token, { expires: new Date(Date.now() + 24 * 3600000) });

    res.status(201).json({ user: savedUser, message: 'User added successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ status: 400, error: messages.join(', ') });
    }
    return res.status(500).json({ status: 500, error: error.message });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { password, emailId } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) throw new Error('Invalid Credential');

    const isSamePassword = await user.validatePassword(password);
    if (!isSamePassword) throw new Error('Invalid Credential');

    const token = await user.getJWT();
    res.cookie('token', token, { expires: new Date(Date.now() + 24 * 3600000) });

    res.status(200).json({ user: user, message: 'Login Successfully' });
  } catch (error) {
    return res.status(500).json({ status: 500, error: error.message });
  }
});

authRouter.post('/logout', async (req, res) => {
  res.cookie('token', null, { expires: new Date(Date.now()) });
  res.status(200).json({ message: 'Logout Successfully' });
});

module.exports = authRouter;
