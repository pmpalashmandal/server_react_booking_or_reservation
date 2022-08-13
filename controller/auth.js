import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { createError } from '../utils/error.js';

//REGISTRATION
export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });
    await newUser.save();
    res.status(200).send('User created successfully');
  } catch (err) {
    next(err);
  }
};
//LOGIN
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return next(createError(404, 'User not found'));
    }
    const isPasswordCorrect = await bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return next(createError(400, 'Wrong username or password'));
    }
    const { password, isAdmin, ...userDataWithoutPassAndAdmin } = user._doc;
    res.status(200).send({ ...userDataWithoutPassAndAdmin });
  } catch (err) {
    next(err);
  }
};
