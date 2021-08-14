import { getRepository } from 'typeorm';
import { isEmpty } from 'class-validator';
import { Router, Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

import Sub from '../entities/Sub';
import User from '../entities/User';
import Post from '../entities/Post';

import auth from '../middleware/auth';
import user from '../middleware/user';
import { ERROR_500 } from '../constants/error';

import { makeId } from '../utils/helper';
import { NextFunction } from 'express-serve-static-core';

const createSub = async (req: Request, res: Response) => {
  const { name, title, description } = req.body;
  const user: User = res.locals.user;

  try {
    let errors: any = {};
    isEmpty(name) && (errors.name = 'Name must not be empty');
    isEmpty(title) && (errors.title = 'Title must not be empty');
    const sub = await getRepository(Sub)
      .createQueryBuilder('sub')
      .where('lower(sub.name) = :name', { name: name.toLowerCase() })
      .getOne();
    sub && (errors.name = 'Sub exists already');
    if (Object.keys(errors).length) {
      throw errors;
    }
  } catch (error) {
    return res.status(400).json(error);
  }

  try {
    const sub = new Sub({
      name,
      title,
      description,
      user,
    });
    await sub.save();
    return res.status(201).json(sub);
  } catch (error) {
    return res.status(500).json(ERROR_500);
  }
};

const getSub = async (req: Request, res: Response) => {
  const { name } = req.params;
  try {
    const sub = await Sub.findOneOrFail({ name });
    const posts = await Post.find({
      where: { sub },
      order: { createdAt: 'DESC' },
      relations: ['comments', 'votes'],
    });
    sub.posts = posts;
    res.locals.user &&
      sub.posts.forEach((post) => post.setUserVote(res.locals.user));
    return res.json(sub);
  } catch (error) {
    return res.status(404).json({ sub: 'Sub not found' });
  }
};

const ownSub = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = res.locals.user;
  try {
    const sub = await Sub.findOneOrFail({
      where: {
        name: req.params.name,
      },
    });
    if (sub.username !== user.username) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.locals.sub = sub;
    return next();
  } catch (error) {
    return res.status(500).json(ERROR_500);
  }
};

const upload = multer({
  storage: multer.diskStorage({
    destination: 'public/images',
    filename: (_, file, callback) => {
      const name = makeId(15);
      callback(null, name + path.extname(file.originalname));
    },
  }),
  fileFilter: (_, file: any, callback: FileFilterCallback) => {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    imageTypes.includes(file.mimetype)
      ? callback(null, true)
      : callback(new Error('Not an image'));
  },
});

const uploadSubImage = async (req: Request, res: Response) => {
  const sub: Sub = res.locals.sub;
  const { type } = req.body;
  const filename = req.file?.filename || '';
  try {
    let oldImageUrn: string = '';
    if (type === 'image') {
      oldImageUrn = sub.imageUrn || '';
      sub.imageUrn = filename;
    } else if (type === 'banner') {
      oldImageUrn = sub.bannerUrn || '';
      sub.bannerUrn = filename;
    } else {
      fs.unlinkSync(req.file?.path || '');
      return res.status(400).json({ error: 'Invalid Type' });
    }
    oldImageUrn && fs.unlinkSync(`public\\images\\${oldImageUrn}`);
    await sub.save();
    return res.json(sub);
  } catch (error) {
    console.log(error);
    return res.status(500).json(ERROR_500);
  }
};

const router = Router();
router.post('/', user, auth, createSub);
router.get('/:name', user, getSub);
router.post(
  '/:name/image',
  user,
  auth,
  ownSub,
  upload.single('file'),
  uploadSubImage,
);

export default router;
