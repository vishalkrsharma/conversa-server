import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../config/generateToken.js';

const signupUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Please Enter All Fields');
  }

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error('User Already Exists ');
  }

  const user = await User.create({
    username,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id, user.username),
    });
  } else {
    res.status(400);
    throw new Error('Failed to create User');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Please Enter All Fields');
  }

  const userExists = await User.findOne({ username });

  if (userExists && (await userExists.matchPassword(password))) {
    res.json({
      _id: userExists._id,
      username: userExists.username,
      token: generateToken(userExists._id, userExists.username),
    });
  } else {
    res.status(401);
    throw new Error('Invalid Username or Password');
  }
});

const searchUser = asyncHandler(async (req, res) => {
  console.log(req.user);

  const keyword = req.query.search
    ? {
        $or: [{ username: { $regex: req.query.search, $options: 'i' } }],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  res.send(users);
});

export { signupUser, loginUser, searchUser };
