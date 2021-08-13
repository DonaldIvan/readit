import { NextFunction, Request, Response } from 'express';
import User from '../entities/User';

const unauthorized = 'Unauthorized';
const auth = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const user: User | undefined = res.locals.user;
    if (!user) throw new Error(unauthorized);
    return next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export default auth;
