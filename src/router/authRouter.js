const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');

const User = require('../model/user');
const { validateSignUpData } = require('../utils/validation');
const { sendMail } = require('../service/mailService');
const { userAuth } = require('../middlewares/auth');

const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, password, emailId } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      verificationToken,
    });

    const savedUser = await user.save();

    const verificationLink = `${process.env.BASE_URL}/verify-email?token=${verificationToken}&email=${emailId}`;

    const subject = 'Verify Your Email Address';
    const html = `
      <h3>Welcome to RoomieG!</h3>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationLink}" target="_blank">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `;

    await sendMail(emailId, subject, null, html);

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

authRouter.get('/verify-email', async (req, res) => {
  const { token, email } = req.query;

  const user = await User.findOne({ emailId: email });

  if (!user) {
    return res.status(400).send('<h1>Verification Failed</h1><p>User not found.</p>');
  }

  if (user.verificationToken !== token) {
    return res.status(400).send('<h1>Verification Failed</h1><p>Invalid or expired token.</p>');
  }
  user.isEmailVerified = true;
  user.verificationToken = null;
  await user.save();

  res
    .status(200)
    .send('<h1>Email Verified Successfully!</h1><p>You can now log in to your account.</p>');
});

authRouter.post('/resend-verification-mail', userAuth, async (req, res) => {
  try {
    const { emailId } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) throw new Error('User not found');

    if (user.isEmailVerified) throw new Error('Email already verified');

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    const verificationLink = `${process.env.BASE_URL}/verify-email?token=${verificationToken}&email=${emailId}`;

    const subject = 'Verify Your Email Address';
    const html = `
      <h3>Welcome to RoomieG!</h3>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationLink}" target="_blank">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `;

    await sendMail(emailId, subject, null, html);

    res.status(200).json({ message: 'Verification mail sent successfully' });
  } catch (error) {
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
