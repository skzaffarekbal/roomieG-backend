const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');

const User = require('../model/user');
const { validateSignUpData } = require('../utils/validation');
const { sendMail } = require('../service/mailService');
const { userAuth } = require('../middlewares/auth');
const { getVerificationEmailHtml, getVerificationResultPage } = require('../utils/emailTemplates');

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

    const verificationLink = `${process.env.BASE_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(emailId)}`;

    const subject = 'Verify your email address - RoomieG';
    const html = getVerificationEmailHtml({
      firstName: savedUser.firstName,
      verificationLink,
    });

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

  const frontendLoginUrl = process.env.FRONTEND_URL;

  if (!email || !token) {
    return res.status(400).send(
      getVerificationResultPage({
        success: false,
        message: 'Invalid verification link. Missing token or email parameter.',
        loginUrl: frontendLoginUrl,
      }),
    );
  }

  const user = await User.findOne({ emailId: email });

  if (!user) {
    return res.status(400).send(
      getVerificationResultPage({
        success: false,
        message: 'User account not found. Please register again.',
        loginUrl: frontendLoginUrl,
      }),
    );
  }

  if (user.isEmailVerified) {
    return res.status(200).send(
      getVerificationResultPage({
        success: true,
        message: 'Your email is already verified! You can proceed to log in.',
        loginUrl: frontendLoginUrl,
      }),
    );
  }

  if (user.verificationToken !== token) {
    return res.status(400).send(
      getVerificationResultPage({
        success: false,
        message:
          'Verification link is invalid or has expired. Please request a new verification email.',
        loginUrl: frontendLoginUrl,
      }),
    );
  }

  user.isEmailVerified = true;
  user.verificationToken = null;
  await user.save();

  return res.status(200).send(
    getVerificationResultPage({
      success: true,
      message: 'Your email has been verified successfully. Welcome to the RoomieG community!',
      loginUrl: frontendLoginUrl,
    }),
  );
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

    const verificationLink = `${process.env.BASE_URL}/verify-email?token=${verificationToken}&email=${encodeURIComponent(emailId)}`;

    const subject = 'Verify your email address - RoomieG';
    const html = getVerificationEmailHtml({
      firstName: user.firstName,
      verificationLink,
    });

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
