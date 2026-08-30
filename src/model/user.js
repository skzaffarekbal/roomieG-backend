const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
  {
    // ─────────────────────────────────────
    // ACCOUNT
    // ─────────────────────────────────────
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      minLength: [3, 'First name at least 3 character.'],
      maxLength: [50, 'First name at most 50 character.'],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      minLength: [2, 'Last name at least 2 character.'],
      maxLength: [50, 'Last name at most 50 character.'],
      trim: true,
    },

    emailId: {
      type: String,
      lowercase: true,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid Email: ' + value);
        }
      },
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
    },

    authProvider: {
      type: String,
      enum: ['email', 'google'],
      default: 'email',
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    accountStatus: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'deleted'],
      default: 'active',
    },

    // ─────────────────────────────────────
    // PROFILE
    // ─────────────────────────────────────
    dateOfBirth: {
      type: Date,
      default: null,
      validate(value) {
        if (!value) return;

        const today = new Date();

        let age = today.getFullYear() - value.getFullYear();

        const monthDifference = today.getMonth() - value.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < value.getDate())) {
          age--;
        }

        if (age < 18) {
          throw new Error('User must be at least 18 years old');
        }

        if (age > 100) {
          throw new Error("User's age can't be above 100");
        }
      },
    },

    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'others'],
        message: 'Gender data is not valid',
      },
      default: null,
    },

    occupation: {
      type: {
        type: String,
        enum: ['student', 'employed', 'self_employed', 'other'],
        default: null,
      },

      title: {
        type: String,
        trim: true,
        maxLength: [100, 'Occupation title at most 100 character.'],
        default: null,
      },

      organization: {
        type: String,
        trim: true,
        maxLength: [150, 'Organization name at most 150 character.'],
        default: null,
      },
    },

    bio: {
      type: String,
      default: null,
      trim: true,
      maxLength: [1024, 'Bio at most 1024 character.'],
    },

    languages: {
      type: [String],
      default: [],
    },

    // ─────────────────────────────────────
    // LOCATION
    // ─────────────────────────────────────
    location: {
      city: {
        type: String,
        trim: true,
      },

      area: {
        type: String,
        trim: true,
      },

      state: {
        type: String,
        trim: true,
      },

      country: {
        type: String,
        default: 'India',
        trim: true,
      },

      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
        },
        coordinates: {
          type: [Number],
        },
      },
    },

    // ─────────────────────────────────────
    // PHOTO
    // ─────────────────────────────────────
    photo: {
      exactPhoto: {
        type: String,
        default:
          'https://img.magnific.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg',
        validate(value) {
          if (value && !validator.isURL(value)) {
            throw new Error('Invalid exact photo URL: ' + value);
          }
        },
      },

      blurPhoto: {
        type: String,
        default:
          'https://img.magnific.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg',
        validate(value) {
          if (value && !validator.isURL(value)) {
            throw new Error('Invalid blur photo URL: ' + value);
          }
        },
      },
    },

    // ─────────────────────────────────────
    // LIFESTYLE
    // ─────────────────────────────────────
    lifestyle: {
      smoking: {
        type: String,
        enum: ['never', 'occasionally', 'regularly'],
      },

      drinking: {
        type: String,
        enum: ['never', 'occasionally', 'regularly'],
      },

      foodPreference: {
        type: String,
        enum: ['vegetarian', 'non_vegetarian', 'eggetarian', 'vegan', 'flexible'],
      },

      pets: {
        hasPets: {
          type: Boolean,
          default: false,
        },

        petFriendly: {
          type: Boolean,
          default: true,
        },
      },

      sleepSchedule: {
        type: String,
        enum: ['early_bird', 'normal', 'night_owl'],
      },

      cleanliness: {
        type: Number,
        min: [1, 'Cleanliness must be at least 1'],
        max: [5, 'Cleanliness cannot be above 5'],
      },

      workMode: {
        type: String,
        enum: ['office', 'hybrid', 'remote', 'student'],
      },

      guests: {
        type: String,
        enum: ['never', 'occasionally', 'frequently'],
      },

      music: {
        type: String,
        enum: ['quiet', 'occasionally', 'frequently'],
      },

      cooking: {
        type: Boolean,
        default: false,
      },
    },

    // ─────────────────────────────────────
    // HOUSING
    // ─────────────────────────────────────
    housing: {
      status: {
        type: String,
        enum: ['looking_for_room', 'has_room', 'both'],
        default: null,
      },

      budget: {
        min: {
          type: Number,
          min: [0, 'Minimum budget cannot be negative'],
        },

        max: {
          type: Number,
          min: [0, 'Maximum budget cannot be negative'],
        },
      },

      moveInDate: {
        type: Date,
      },

      preferredLocations: [
        {
          city: {
            type: String,
            trim: true,
          },

          areas: {
            type: [String],
            default: [],
          },
        },
      ],

      roomType: {
        type: String,
        enum: ['private', 'shared', 'any'],
      },

      furnished: {
        type: Boolean,
      },

      genderPreference: {
        type: String,
        enum: ['male', 'female', 'any'],
      },

      preferredAge: {
        min: {
          type: Number,
          min: [18, 'Preferred minimum age cannot be below 18'],
          max: [100, 'Preferred minimum age cannot be above 100'],
        },

        max: {
          type: Number,
          min: [18, 'Preferred maximum age cannot be below 18'],
          max: [100, 'Preferred maximum age cannot be above 100'],
        },
      },

      room: {
        rent: {
          type: Number,
          min: [0, 'Rent cannot be negative'],
        },

        deposit: {
          type: Number,
          min: [0, 'Deposit cannot be negative'],
        },

        availableBeds: {
          type: Number,
          min: [1, 'Available beds must be at least 1'],
        },
      },
    },

    // ─────────────────────────────────────
    // APP
    // ─────────────────────────────────────
    profileCompleted: {
      type: Boolean,
      default: false,
    },

    preferences: {
      notifications: {
        type: Boolean,
        default: true,
      },
    },

    privacy: {
      showLocation: {
        type: String,
        enum: ['city_only', 'area', 'hidden'],
        default: 'city_only',
      },
    },

    // ─────────────────────────────────────
    // SUBSCRIPTION
    // ─────────────────────────────────────
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'silver', 'gold'],
        default: 'free',
      },

      expiresAt: {
        type: Date,
        default: null,
      },
    },

    // ─────────────────────────────────────
    // ACTIVITY
    // ─────────────────────────────────────
    lastLoginAt: {
      type: Date,
      default: null,
    },

    lastActiveAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Clean incomplete GeoJSON coordinates before saving to prevent 2dsphere indexing errors
userSchema.pre('save', function () {
  if (
    this.location &&
    this.location.coordinates &&
    (!Array.isArray(this.location.coordinates.coordinates) ||
      this.location.coordinates.coordinates.length !== 2)
  ) {
    this.location.coordinates = undefined;
  }
});

// ─────────────────────────────────────────
// INDEXES
// ─────────────────────────────────────────

userSchema.index(
  {
    'location.coordinates': '2dsphere',
  },
  { sparse: true },
);

userSchema.index({
  'housing.status': 1,
});

userSchema.index({
  gender: 1,
});

userSchema.index({
  'occupation.type': 1,
});

userSchema.index({
  dateOfBirth: 1,
});

userSchema.index({
  lastActiveAt: -1,
});

// ─────────────────────────────────────────
// JWT
// ─────────────────────────────────────────

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign(
    {
      _id: user._id,
      isAdmin: user.isAdmin,
      accountStatus: user.accountStatus,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    },
  );

  return token;
};

// ─────────────────────────────────────────
// PASSWORD VALIDATION
// ─────────────────────────────────────────

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;

  const passwordHash = user.password;

  return await bcrypt.compare(passwordInputByUser, passwordHash);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
