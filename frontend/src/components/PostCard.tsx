/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

import { IPost } from 'services/PostService';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import { postVote } from 'services/MiscService';

import classes from 'classnames';

type PostCardProps = {
  post: IPost;
};

type WithChildren = { children?: React.ReactNode };

const ActionButton = ({ children }: WithChildren) => (
  <div className="p-1 mr-1 text-xs text-gray-400">{children}</div>
);

const PostCard = ({ post }: PostCardProps): JSX.Element => {
  const {
    subName,
    username,
    createdAt,
    url,
    title,
    body,
    voteScore,
    commentCount,
    slug,
    identifier,
    userVote,
  } = post;
  const subLink = `/r/${subName}`;
  const userLink = `/u/${username}`;

  const vote = async (value: number) => {
    try {
      const data = postVote({
        value,
        slug,
        identifier,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex mb-4 bg-white rounded">
      <div className="w-10 py-3 text-center bg-gray-200 rounded-l">
        <div
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
          onClick={() => vote(1)}
        >
          <i
            className={classes('icon-arrow-up', {
              'text-red-500': userVote === 1,
            })}
          ></i>
        </div>
        <p className="text-xs font-bold">{voteScore}</p>
        <div
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
          onClick={() => vote(-1)}
        >
          <i
            className={classes('icon-arrow-down', {
              'text-blue-600': userVote === -1,
            })}
          ></i>
        </div>
      </div>
      <div className="w-full p-2">
        <div className="flex items-center">
          <Link href={subLink}>
            <>
              <img
                src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                alt={subLink}
              />
              <a className="font-bold text-ts hover:underline">{subLink}</a>
            </>
          </Link>
          <p className="text-xs text-gray-500">
            <span className="mx-1">•</span>
            Posted by
            <Link href={userLink}>
              <a className="mx-1 hover:underline">{userLink}</a>
            </Link>
            <Link href={url}>
              <a className="mx-1 hover:underline">
                {dayjs(createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        <Link href={url}>
          <a className="my-1 text-lg font-medium">{title}</a>
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}
        <div className="flex">
          <Link href={url}>
            <a>
              <ActionButton>
                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                <span className="font-bold">{commentCount} comments</span>
              </ActionButton>
            </a>
          </Link>
          <ActionButton>
            <i className="mr-1 fas fa-share fa-xs"></i>
            <span className="font-bold">Share</span>
          </ActionButton>
          <ActionButton>
            <i className="mr-1 fas fa-bookmark fa-xs"></i>
            <span className="font-bold">Save</span>
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
