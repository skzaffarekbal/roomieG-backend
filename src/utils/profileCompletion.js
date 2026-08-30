const isValidDate = (value) => {
  if (!value) return false;

  const date = new Date(value);

  return !Number.isNaN(date.getTime());
};

const getProfileCompletion = (user) => {
  const missing = [];

  // Basic
  if (!user.firstName?.trim()) missing.push('firstName');
  if (!user.lastName?.trim()) missing.push('lastName');
  if (!isValidDate(user.dateOfBirth)) {
    missing.push('dateOfBirth');
  }
  if (!user.gender) missing.push('gender');

  // Occupation
  if (!user.occupation?.type) {
    missing.push('occupation.type');
  }

  if (!user.occupation?.title?.trim()) {
    missing.push('occupation.title');
  }

  if (!user.occupation?.organization?.trim()) {
    missing.push('occupation.organization');
  }

  // Location
  if (!user.location?.city?.trim()) {
    missing.push('location.city');
  }

  if (!user.location?.state?.trim()) {
    missing.push('location.state');
  }

  if (!user.location?.country?.trim()) {
    missing.push('location.country');
  }

  // Photo
  if (!user.photo?.exactPhoto) {
    missing.push('photo.exactPhoto');
  }

  if (!user.photo?.blurPhoto) {
    missing.push('photo.blurPhoto');
  }

  // Lifestyle
  if (!user.lifestyle?.smoking) {
    missing.push('lifestyle.smoking');
  }

  if (!user.lifestyle?.drinking) {
    missing.push('lifestyle.drinking');
  }

  if (!user.lifestyle?.foodPreference) {
    missing.push('lifestyle.foodPreference');
  }

  if (!user.lifestyle?.sleepSchedule) {
    missing.push('lifestyle.sleepSchedule');
  }

  if (user.lifestyle?.cleanliness == null) {
    missing.push('lifestyle.cleanliness');
  }

  if (!user.lifestyle?.workMode) {
    missing.push('lifestyle.workMode');
  }

  if (!user.lifestyle?.guests) {
    missing.push('lifestyle.guests');
  }

  if (!user.lifestyle?.music) {
    missing.push('lifestyle.music');
  }

  if (user.lifestyle?.cooking === undefined) {
    missing.push('lifestyle.cooking');
  }

  if (user.lifestyle?.pets?.hasPets === undefined) {
    missing.push('lifestyle.pets.hasPets');
  }

  if (user.lifestyle?.pets?.petFriendly === undefined) {
    missing.push('lifestyle.pets.petFriendly');
  }

  // Housing
  if (!user.housing?.status) {
    missing.push('housing.status');
  }

  if (user.housing?.budget?.min == null) {
    missing.push('housing.budget.min');
  }

  if (user.housing?.budget?.max == null) {
    missing.push('housing.budget.max');
  }

  if (!user.housing?.moveInDate) {
    missing.push('housing.moveInDate');
  }

  if (
    !Array.isArray(user.housing?.preferredLocations) ||
    user.housing.preferredLocations.length === 0
  ) {
    missing.push('housing.preferredLocations');
  }

  if (!user.housing?.roomType) {
    missing.push('housing.roomType');
  }

  if (user.housing?.furnished === undefined) {
    missing.push('housing.furnished');
  }

  if (!user.housing?.genderPreference) {
    missing.push('housing.genderPreference');
  }

  if (user.housing?.preferredAge?.min == null) {
    missing.push('housing.preferredAge.min');
  }

  if (user.housing?.preferredAge?.max == null) {
    missing.push('housing.preferredAge.max');
  }

  return {
    profileCompleted: missing.length === 0,
    missing,
    completionPercentage: calculateCompletionPercentage(missing),
  };
};

const calculateCompletionPercentage = (missing) => {
  const totalRequiredFields = 33;

  const completed = totalRequiredFields - missing.length;

  return Math.max(0, Math.min(100, Math.round((completed / totalRequiredFields) * 100)));
};

module.exports = {
  getProfileCompletion,
};
