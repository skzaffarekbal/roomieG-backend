const { getProfileCompletion } = require('../utils/profileCompletion');

const profileCompleted = async (req, res, next) => {
  try {
    const user = req.loggedInUser;

    const completion = getProfileCompletion(user);

    if (!completion.profileCompleted) {
      return res.status(403).json({
        status: 403,
        code: 'PROFILE_INCOMPLETE',
        message: 'Please complete your profile before accessing the feed.',
        data: {
          profileCompleted: false,
          missing: completion.missing,
        },
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  profileCompleted,
};
