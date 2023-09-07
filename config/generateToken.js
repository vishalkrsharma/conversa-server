import jwt from 'jsonwebtoken';

const generateToken = (_id, username) => {
  return jwt.sign({ _id, username }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;
