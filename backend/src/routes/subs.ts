import { getRepository } from 'typeorm';
import { isEmpty } from 'class-validator';
import { Router, Request, Response } from 'express';
import Sub from '../entities/Sub';
import User from '../entities/User';
import Post from '../entities/Post';

import auth from '../middleware/auth';

import { ERROR_500 } from '../constants/error';

import user from '../middleware/user';

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

const router = Router();
router.post('/', user, auth, createSub);
router.get('/:name', user, getSub);

export default router;
