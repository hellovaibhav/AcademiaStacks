import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  fname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    require: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  branch: {
    type: String,
    required: true
  },
  batch: {
    type: Number,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  otp: {
    type: Number
  },
  otpExpires: {
    type: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  refreshToken: {
    type: String
  },
  savedItem: [{
    type: String,
    default: '0'
  }]
}, {timestamps: true});

// SECURITY: Add indexes for performance and security
userSchema.index({email: 1}, {unique: true});
userSchema.index({isVerified: 1, createdAt: 1});
userSchema.index({refreshToken: 1});

// SECURITY: Prevent admin escalation and validate data
userSchema.pre('save', function (next) {
  // Force isAdmin to false for new registrations (unless explicitly set by admin)
  if (this.isNew && this.isAdmin && !this.isModifiedByAdmin) {
    this.isAdmin = false;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.email)) {
    next(new Error('Invalid email format'));
    return;
  }

  next();
});

// SECURITY: Remove sensitive data from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.otp;
  delete user.otpExpires;
  delete user.refreshToken;
  return user;
};

userSchema.plugin(passportLocalMongoose);

export default mongoose.model('User', userSchema);