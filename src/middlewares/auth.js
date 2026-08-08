const jwt = require('jsonwebtoken');
const User = require('../model/User');

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ status: 401, error: 'Please Login' });
    const decodedObj = jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decodedObj;

    let user = await User.findById(_id);
    if (!user) throw new Error('User not exist.');

    req.loggedInUser = user;
    next();
  } catch (error) {
    return res.status(500).json({ status: 500, error: error.message });
  }
};

const adminAuth = (req, res, next) => {
  if (req.loggedInUser && req.loggedInUser?.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

module.exports = { adminAuth, userAuth };
