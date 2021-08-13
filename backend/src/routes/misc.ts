import { Router, Request, Response } from 'express';

import Post from '../entities/Post';
import User from '../entities/User';
import Vote from '../entities/Vote';
import Comment from '../entities/Comment';

import auth from '../middleware/auth';
import { ERROR_500 } from '../constants/error';
import user from '../middleware/user';

const vote = async (req: Request, res: Response) => {
  const { identifier, slug, commentIdentifier, value } = req.body;
  if (![-1, 0, 1].includes(value)) {
    return res.status(400).json({
      value: 'Value must be -1,0 or 1',
    });
  }
  const user: User = res.locals.user;
  console.log('user is here', user);
  try {
    let post = await Post.findOneOrFail({ identifier, slug });
    let vote: Vote | undefined;
    let comment: Comment | undefined;
    if (commentIdentifier) {
      comment = await Comment.findOneOrFail({ identifier: commentIdentifier });
      vote = await Vote.findOne({ user, comment });
    } else {
      vote = await Vote.findOne({ user, post });
    }

    if (!vote && value === 0) {
      return res.status(404).json({
        error: 'Vote not found',
      });
    } else if (!vote) {
      vote = new Vote({
        user,
        value,
      });
      if (comment) vote.comment = comment;
      else vote.post = post;
      await vote.save();
    } else if (value === 0) {
      await vote.remove();
    } else if (vote.value !== value) {
      vote.value = value;
      await vote.save();
    }
    post = await Post.findOneOrFail(
      { identifier, slug },
      { relations: ['comments', 'comments.votes', 'sub', 'votes'] },
    );
    post.setUserVote(user);
    post.comments.forEach((comment) => comment.setUserVote(user));
    return res.json(post);
  } catch (error) {
    return res.status(500).json(ERROR_500);
  }
};

const router = Router();
router.post('/vote', user, auth, vote);

export default router;
