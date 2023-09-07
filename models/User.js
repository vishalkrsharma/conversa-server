import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre('save', async function (next) {
  if (!this.isModified) {
    next();
  }

  this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
});

const User = model('User', UserSchema);

export default User;
