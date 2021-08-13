import { NextFunction, Request, Response } from 'express';
import User from '../entities/User';
import jwt from 'jsonwebtoken';

const user = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) return next();
    const { username }: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    );

    const user = await User.findOne({ username });

    res.locals.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export default user;
