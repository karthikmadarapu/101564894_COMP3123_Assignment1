const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema(   //creating a userSchema instance  via mongooose core module.
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,        // creates a unique index in MongoDB
      trim: true,          // removes spaces at the start/end
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,     // "Sunny@X.com" and "sunny@x.com" become the same
      match: [/^\S+@\S+\.\S+$/, 'Email format is invalid'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,       // NOT returned by queries unless explicitly asked for
    },
  },
  {
    // The assignment wants created_at / updated_at (Mongoose's default is createdAt/updatedAt)
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Runs automatically before every .save() / .create()
userSchema.pre('save', async function () {
  // Only hash if the password is new or changed; otherwise we'd hash the hash
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

// Instance method used later at login: compares a plain password to the stored hash
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Controls what the object looks like when sent as JSON in a response
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);