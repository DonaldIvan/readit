import { NextFunction, Request, Response } from 'express';
import User from '../entities/User';
import jwt from 'jsonwebtoken';

const unauthorized = 'Unauthorized';
const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error(unauthorized);
    const { username }: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    );

    const user = await User.findOne({ username });
    if (!user) throw new Error(unauthorized);
    res.locals.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export default auth;
