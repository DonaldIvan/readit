import { isEmpty } from 'class-validator';
import { Router, Request, Response } from 'express';
import { ERROR_500 } from '../constants/error';
import Comment from '../entities/Comment';
import Post from '../entities/Post';
import Sub from '../entities/Sub';
import User from '../entities/User';
import auth from '../middleware/auth';
import user from '../middleware/user';

const createPost = async (req: Request, res: Response) => {
  const { title, body, subName } = req.body;
  const user: User = res.locals.user;

  try {
    if (isEmpty(title)) {
      return res.status(400).json({ title: 'Title must not be empty' });
    }
    const sub = await Sub.findOneOrFail({ name: subName });

    const post = new Post({
      title,
      body,
      sub,
      user,
    });

    await post.save();
    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json(ERROR_500);
  }
};

const getPosts = async (_: Request, res: Response) => {
  try {
    const posts = await Post.find({
      order: {
        createdAt: 'DESC',
      },
      relations: ['comments', 'votes', 'sub'],
    });
    if (res.locals.user) {
      posts.forEach((post) => post.setUserVote(res.locals.user));
    }
    return res.json(posts);
  } catch (error) {
    return res.status(500).json(ERROR_500);
  }
};

const getPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  try {
    const post = await Post.findOneOrFail(
      {
        identifier,
        slug,
      },
      {
        relations: ['sub', 'votes', 'comments'],
      },
    );
    if (res.locals.user) {
      post.setUserVote(res.locals.user);
    }
    return res.json(post);
  } catch (error) {
    return res.status(404).json({ error: 'Post not found' });
  }
};

const commentOnPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  const { body } = req.body;
  const user: User = res.locals.user;
  try {
    const post = await Post.findOneOrFail({
      identifier,
      slug,
    });

    const comment = new Comment({
      body,
      user,
      post,
    });

    await comment.save();
    return res.status(201).json(comment);
  } catch (error) {
    return res.status(404).json({ error: 'Post not found' });
  }
};

const router = Router();
router.post('/', user, auth, createPost);
router.get('/', user, getPosts);
router.get('/:identifier/:slug', user, getPost);
router.post('/:identifier/:slug/comments', user, auth, commentOnPost);

export default router;
