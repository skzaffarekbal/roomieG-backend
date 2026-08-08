const express = require('express');
const bcrypt = require('bcrypt');

const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData, validatePassword } = require('../utils/validation');

const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    let user = req.loggedInUser;
    res.status(200).json({ message: 'User Profile', data: user });
  } catch (error) {
    return res.status(500).json({ status: 500, error: error.message });
  }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) throw new Error('Invalid edit request.');

    const loggedInUser = req.loggedInUser;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res
      .status(200)
      .json({ message: `${loggedInUser.firstName}'s Profile Updated.`, data: loggedInUser });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ status: 400, error: messages.join(', ') });
    }
    return res.status(500).json({ status: 500, error: error.message });
  }
});

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
  try {
    validatePassword(req);
    const { newPassword } = req.body;

    let loggedInUser = req.loggedInUser;
    loggedInUser.password = await bcrypt.hash(newPassword, 10);
    loggedInUser.save();

    res.status(200).json({ message: `${loggedInUser.firstName}'s new password updated.` });
  } catch (error) {
    return res.status(500).json({ status: 500, error: error.message });
  }
});

module.exports = profileRouter;
