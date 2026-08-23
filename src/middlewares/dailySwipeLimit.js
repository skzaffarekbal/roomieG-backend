const ConnectioRequest = require('../model/connectionRequest');

const dailySwipeLimit = async (req, res, next) => {
  try {
    const fromUserId = req.loggedInUser._id;
    const { isPremium } = req.loggedInUser;

    const DAILY_LIMIT = isPremium ? 20 : 10;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const interactionsInLast24Hours = await ConnectioRequest.countDocuments({
      fromUserId: fromUserId,
      createdAt: { $gte: twentyFourHoursAgo },
    });

    if (interactionsInLast24Hours >= DAILY_LIMIT) {
      return res.status(403).json({ status: 403, message: 'Daily limit reached.' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ status: 500, error: error.message });
  }
};

module.exports = { dailySwipeLimit };
