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

const validatePassword = (req) => {
  const { newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword)
    throw new Error('Password and Confirm Password must be same.');

  if (!validator.isStrongPassword(newPassword))
    throw new Error(
      'Password must be at least 8 characters and contain lowercase, uppercase, numbers, and symbols.',
    );
};

module.exports = { validateSignUpData, validatePassword };
