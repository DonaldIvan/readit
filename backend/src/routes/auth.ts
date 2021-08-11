import { validate, isEmpty } from 'class-validator';
import { Request, Response, Router } from 'express';
import User from '../entities/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import auth from '../middleware/auth';
import { ERROR_500 } from '../constants/error';

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    // todo validate
    let errors: any = {};
    const emailUser = await User.findOne({ email });
    const usernameUser = await User.findOne({ username });

    emailUser && (errors.email = 'Email is already taken');
    usernameUser && (errors.username = 'Username is already taken');

    const user = new User({ email, username, password });
    errors = await validate(user);
    if (errors && errors.length) return res.status(400).json({ errors });
    await user.save();

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json(ERROR_500);
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    let errors: any = {};
    isEmpty(username) && (errors.username = 'Username must not be empty');
    isEmpty(password) && (errors.password = 'Password must not be empty');
    if (!!Object.keys(errors).length) {
      return res.status(400).json(errors);
    }

    const user = await User.findOne({ username });
    if (!user) throw new Error('Username/password not found');
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new Error('Username/password not found');

    const token = jwt.sign({ username }, process.env.JWT_SECRET as string);
    res.set(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600,
        path: '/',
      }),
    );
    return res.json({ user });
  } catch (error) {
    return res.status(404).json({
      error: error.message,
    });
  }
};

const me = async (_: Request, res: Response) => {
  return res.json(res.locals.user);
};

const logout = (_: Request, res: Response) => {
  res.set(
    'Set-Cookie',
    cookie.serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    }),
  );
  return res.status(200).json({ success: true });
};

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);
router.get('/logout', auth, logout);

export default router;
