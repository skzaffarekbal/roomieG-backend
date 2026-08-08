const validator = require('validator');

const validateSignUpData = (req) => {
  // Removed 'res'
  const { firstName, lastName, password, emailId } = req.body;

  if (!firstName || !lastName) {
    throw new Error('Name is not valid');
  }
  if (!validator.isEmail(emailId)) {
    throw new Error('Email is not valid');
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      'Password must be at least 8 characters and contain lowercase, uppercase, numbers, and symbols.',
    );
  }
};

const validateEditProfileData = (req) => {
  let data = req.body;
  const ALLOW_UPDATES = [
    'firstName',
    'lastName',
    'photoUrl',
    'gender',
    'about',
    'age',
    'skills',
    'isActive',
  ];
  const isUpdateAllowed = Object.keys(data).every((k) => ALLOW_UPDATES.includes(k));

  if (!isUpdateAllowed) throw new Error('Invalid edit request.');

  if (req.body?.skills?.length > 10) throw new Error("Skill can't more than 10");

  if (req.body?.photoUrl && !validator.isURL(req.body?.photoUrl))
    throw new Error('Invalid URL: ' + req.body?.photoUrl);

  if (req.body?.about && req.body?.about?.length > 1024)
    throw new Error('About must be in 1000 character.');

  return isUpdateAllowed;
};

const validatePassword = (req) => {
  const { newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword)
    throw new Error('Password and Confirm Password must be same.');

  if (!validator.isStrongPassword(newPassword))
    throw new Error(
      'Password must be at least 8 characters and contain lowercase, uppercase, numbers, and symbols.',
    );
};

module.exports = { validateSignUpData, validateEditProfileData, validatePassword };
