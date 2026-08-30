const express = require('express');
const bcrypt = require('bcrypt');
const validator = require('validator');

const { userAuth } = require('../middlewares/auth');
const { handleValidationError } = require('../utils/helper');
const { getProfileCompletion } = require('../utils/profileCompletion');

const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.loggedInUser;

    return res.status(200).json({
      message: 'User Profile',
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
});

profileRouter.patch('/profile/basic', userAuth, async (req, res) => {
  try {
    const user = req.loggedInUser;

    const { firstName, lastName, dateOfBirth, gender, bio, languages } = req.body;

    if (firstName !== undefined) {
      if (typeof firstName !== 'string') throw new Error('First name must be a string.');

      const value = firstName.trim();

      if (value.length < 3) throw new Error('First name at least 3 character.');

      if (value.length > 50) throw new Error('First name at most 50 character.');

      user.firstName = value;
    }

    if (lastName !== undefined) {
      if (typeof lastName !== 'string') throw new Error('Last name must be a string.');

      const value = lastName.trim();

      if (value.length < 2) throw new Error('Last name at least 2 character.');

      if (value.length > 50) throw new Error('Last name at most 50 character.');

      user.lastName = value;
    }

    if (dateOfBirth !== undefined) {
      user.dateOfBirth = dateOfBirth;
    }

    if (gender !== undefined) {
      user.gender = gender;
    }

    if (bio !== undefined) {
      if (typeof bio !== 'string') throw new Error('Bio must be a string.');

      if (bio.length > 1024) throw new Error('Bio at most 1024 character.');

      user.bio = bio.trim();
    }

    if (languages !== undefined) {
      if (!Array.isArray(languages)) throw new Error('Languages must be an array.');

      if (languages.length > 10) throw new Error('Languages at most 10 languages.');

      user.languages = languages;
    }

    await user.save();

    return res.status(200).json({
      message: `${user.firstName}'s basic profile updated.`,
      data: user,
    });
  } catch (error) {
    return handleValidationError(res, error);
  }
});

profileRouter.patch('/profile/occupation', userAuth, async (req, res) => {
  try {
    const user = req.loggedInUser;

    const { type, title, organization } = req.body;

    const allowedTypes = ['student', 'employed', 'self_employed', 'other'];

    if (type !== undefined) {
      if (!allowedTypes.includes(type)) throw new Error('Occupation type is not valid.');

      user.occupation.type = type;
    }

    if (title !== undefined) {
      if (typeof title !== 'string') throw new Error('Occupation title must be a string.');

      if (title.trim().length > 100) throw new Error('Occupation title at most 100 character.');

      user.occupation.title = title.trim();
    }

    if (organization !== undefined) {
      if (typeof organization !== 'string') throw new Error('Organization name must be a string.');

      if (organization.trim().length > 150)
        throw new Error('Organization name at most 150 character.');

      user.occupation.organization = organization.trim();
    }

    await user.save();

    return res.status(200).json({
      message: `${user.firstName}'s occupation updated.`,
      data: user.occupation,
    });
  } catch (error) {
    return handleValidationError(res, error);
  }
});

profileRouter.patch('/profile/location', userAuth, async (req, res) => {
  try {
    const user = req.loggedInUser;

    const { city, area, state, country, coordinates } = req.body;

    if (city !== undefined) {
      user.location.city = city.trim();
    }

    if (area !== undefined) {
      user.location.area = area.trim();
    }

    if (state !== undefined) {
      user.location.state = state.trim();
    }

    if (country !== undefined) {
      user.location.country = country.trim();
    }

    if (coordinates !== undefined) {
      if (!Array.isArray(coordinates) || coordinates.length !== 2)
        throw new Error('Coordinates must contain [longitude, latitude].');

      const [longitude, latitude] = coordinates;

      if (typeof longitude !== 'number' || typeof latitude !== 'number')
        throw new Error('Longitude and latitude must be numbers.');

      if (longitude < -180 || longitude > 180) throw new Error('Invalid longitude.');

      if (latitude < -90 || latitude > 90) throw new Error('Invalid latitude.');

      user.location.coordinates = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    }

    await user.save();

    return res.status(200).json({
      message: `${user.firstName}'s location updated.`,
      data: user.location,
    });
  } catch (error) {
    return handleValidationError(res, error);
  }
});

profileRouter.patch('/profile/lifestyle', userAuth, async (req, res) => {
  try {
    const user = req.loggedInUser;

    const {
      smoking,
      drinking,
      foodPreference,
      pets,
      sleepSchedule,
      cleanliness,
      workMode,
      guests,
      music,
      cooking,
    } = req.body;

    if (smoking !== undefined) {
      user.lifestyle.smoking = smoking;
    }

    if (drinking !== undefined) {
      user.lifestyle.drinking = drinking;
    }

    if (foodPreference !== undefined) {
      user.lifestyle.foodPreference = foodPreference;
    }

    if (pets !== undefined) {
      if (typeof pets !== 'object' || pets === null) {
        throw new Error('Invalid pets data.');
      }

      user.lifestyle.pets = pets;
    }

    if (sleepSchedule !== undefined) {
      user.lifestyle.sleepSchedule = sleepSchedule;
    }

    if (cleanliness !== undefined) {
      user.lifestyle.cleanliness = cleanliness;
    }

    if (workMode !== undefined) {
      user.lifestyle.workMode = workMode;
    }

    if (guests !== undefined) {
      user.lifestyle.guests = guests;
    }

    if (music !== undefined) {
      user.lifestyle.music = music;
    }

    if (cooking !== undefined) {
      user.lifestyle.cooking = cooking;
    }

    await user.save();

    return res.status(200).json({
      message: `${user.firstName}'s lifestyle updated.`,
      data: user.lifestyle,
    });
  } catch (error) {
    return handleValidationError(res, error);
  }
});

profileRouter.patch('/profile/housing', userAuth, async (req, res) => {
  try {
    const user = req.loggedInUser;

    const {
      status,
      budget,
      moveInDate,
      preferredLocations,
      roomType,
      furnished,
      genderPreference,
      preferredAge,
      room,
    } = req.body;

    if (status !== undefined) {
      user.housing.status = status;
    }

    if (budget !== undefined) {
      if (typeof budget !== 'object' || budget === null) throw new Error('Invalid budget data.');

      if (budget.min !== undefined && budget.max !== undefined && budget.min > budget.max)
        throw new Error('Minimum budget cannot be greater than maximum budget.');

      user.housing.budget = budget;
    }

    if (moveInDate !== undefined) {
      user.housing.moveInDate = moveInDate;
    }

    if (preferredLocations !== undefined) {
      if (!Array.isArray(preferredLocations)) {
        throw new Error('Preferred locations must be an array.');
      }

      user.housing.preferredLocations = preferredLocations;
    }

    if (roomType !== undefined) {
      user.housing.roomType = roomType;
    }

    if (furnished !== undefined) {
      user.housing.furnished = furnished;
    }

    if (genderPreference !== undefined) {
      user.housing.genderPreference = genderPreference;
    }

    if (preferredAge !== undefined) {
      if (
        preferredAge.min !== undefined &&
        preferredAge.max !== undefined &&
        preferredAge.min > preferredAge.max
      ) {
        throw new Error('Preferred minimum age cannot be greater than maximum age.');
      }

      user.housing.preferredAge = preferredAge;
    }

    if (room !== undefined) {
      user.housing.room = room;
    }

    await user.save();

    return res.status(200).json({
      message: `${user.firstName}'s housing preference updated.`,
      data: user.housing,
    });
  } catch (error) {
    return handleValidationError(res, error);
  }
});

profileRouter.patch('/profile/photo', userAuth, async (req, res) => {
  try {
    const user = req.loggedInUser;

    const { exactPhoto, blurPhoto } = req.body;

    if (exactPhoto !== undefined && exactPhoto !== null && !validator.isURL(exactPhoto)) {
      throw new Error('Invalid exact photo URL: ' + exactPhoto);
    }

    if (blurPhoto !== undefined && blurPhoto !== null && !validator.isURL(blurPhoto)) {
      throw new Error('Invalid blur photo URL: ' + blurPhoto);
    }

    user.photo.exactPhoto = exactPhoto;
    user.photo.blurPhoto = blurPhoto;

    await user.save();

    return res.status(200).json({
      message: `${user.firstName}'s profile photo updated.`,
      data: user.photo,
    });
  } catch (error) {
    return handleValidationError(res, error);
  }
});

profileRouter.patch('/profile/preferences', userAuth, async (req, res) => {
  try {
    const user = req.loggedInUser;

    const { notifications } = req.body;

    if (notifications !== undefined) {
      if (typeof notifications !== 'boolean') {
        throw new Error('Notifications must be true or false.');
      }

      user.preferences.notifications = notifications;
    }

    await user.save();

    return res.status(200).json({
      message: `${user.firstName}'s preferences updated.`,
      data: user.preferences,
    });
  } catch (error) {
    return handleValidationError(res, error);
  }
});

profileRouter.patch('/profile/privacy', userAuth, async (req, res) => {
  try {
    const user = req.loggedInUser;

    const { showLocation } = req.body;

    const allowedValues = ['city_only', 'area', 'hidden'];

    if (showLocation !== undefined) {
      if (!allowedValues.includes(showLocation)) {
        throw new Error('Invalid location privacy setting.');
      }

      user.privacy.showLocation = showLocation;
    }

    await user.save();

    return res.status(200).json({
      message: `${user.firstName}'s privacy settings updated.`,
      data: user.privacy,
    });
  } catch (error) {
    return handleValidationError(res, error);
  }
});

profileRouter.get('/profile/completion', userAuth, async (req, res) => {
  try {
    const user = req.loggedInUser;

    const completion = getProfileCompletion(user);

    // Keep database state synchronized.
    if (user.profileCompleted !== completion.profileCompleted) {
      user.profileCompleted = completion.profileCompleted;

      await user.save();
    }

    return res.status(200).json({
      message: 'Profile completion status.',
      data: completion,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
});

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new Error('Current password, new password and confirm password are required.');
    }

    if (newPassword !== confirmPassword) {
      throw new Error('Password and Confirm Password must be same.');
    }

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error(
        'Password must be at least 8 characters and contain lowercase, uppercase, numbers, and symbols.',
      );
    }

    const user = req.loggedInUser;

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect.');
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    return res.status(200).json({
      message: `${user.firstName}'s password updated.`,
    });
  } catch (error) {
    return handleValidationError(res, error);
  }
});

module.exports = profileRouter;
