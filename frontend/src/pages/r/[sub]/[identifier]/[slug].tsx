import { useState, FormEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Image from 'next/image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import classNames from 'classnames';

import { IPost, IComment } from 'types';
import Sidebar from 'components/Sidebar';
import { useAuthState } from 'context/auth';
import ActionButton from 'components/ActionButton';

import { postVote } from 'services/MiscService';
import { postComment } from 'services/PostService';

dayjs.extend(relativeTime);

const PostPage = (): JSX.Element => {
  const [newComment, setNewComment] = useState('');
  const { authenticated, user } = useAuthState();
  const router = useRouter();
  const { identifier, sub, slug } = router.query;

  const { data: post, error } = useSWR<IPost>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null,
  );

  const { data: comments, revalidate } = useSWR<IComment[]>(
    identifier && slug ? `/posts/${identifier}/${slug}/comments` : null,
  );

  if (error) router.push('/');

  const vote = async (value: number, comment?: IComment) => {
    if (!authenticated) router.push('/login');

    if (
      (post && !comment && value === post.userVote) ||
      (comment && comment.userVote === value)
    )
      value = 0;

    try {
      slug &&
        identifier &&
        (await postVote({
          value,
          slug: slug.toString(),
          identifier: identifier.toString(),
          commentIdentifier: comment?.identifier,
        }));
      await revalidate();
    } catch (error) {}
  };

  const submitComment = async (event: FormEvent) => {
    event.preventDefault();
    if (!newComment.trim() || !identifier || !slug) return;

    try {
      await postComment({
        identifier: identifier.toString(),
        slug: slug.toString(),
        body: newComment,
      });
      setNewComment('');

      await revalidate();
    } catch (err) {}
  };

  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>
      <Link href={`/r/${sub}`}>
        <a>
          <div className="flex items-center w-full h-20 p-8 bg-blue-500">
            <div className="container flex">
              {post && (
                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                  {post.sub && (
                    <Image
                      src={post.sub.imageUrl}
                      height={(8 * 16) / 4}
                      width={(8 * 16) / 4}
                      alt={post.sub.name}
                    />
                  )}
                </div>
              )}
              <p className="text-xl font-semibold text-white">/r/{sub}</p>
            </div>
          </div>
        </a>
      </Link>
      <div className="container flex pt-5">
        <div className="w-160">
          <div className="bg-white rounded">
            {post && (
              <>
                <div className="flex">
                  <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                    <div
                      className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                      onClick={() => vote(1)}
                    >
                      <i
                        className={classNames('icon-arrow-up', {
                          'text-red-500': post.userVote === 1,
                        })}
                      ></i>
                    </div>
                    <p className="text-xs font-bold">{post.voteScore}</p>
                    <div
                      className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                      onClick={() => vote(-1)}
                    >
                      <i
                        className={classNames('icon-arrow-down', {
                          'text-blue-600': post.userVote === -1,
                        })}
                      ></i>
                    </div>
                  </div>
                  <div className="py-2 pr-2">
                    <div className="flex items-center">
                      <p className="text-xs text-gray-500">
                        Posted by
                        <Link href={`/u/${post.username}`}>
                          <a className="mx-1 hover:underline">
                            /u/{post.username}
                          </a>
                        </Link>
                        <Link href={post.url}>
                          <a className="mx-1 hover:underline">
                            {dayjs(post.createdAt).fromNow()}
                          </a>
                        </Link>
                      </p>
                    </div>
                    <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                    <p className="my-3 text-sm">{post.body}</p>
                    <div className="flex">
                      <Link href={post.url}>
                        <a>
                          <ActionButton>
                            <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                            <span className="font-bold">
                              {post.commentCount} Comments
                            </span>
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
                <div className="pl-10 pr-6 mb-4">
                  {authenticated ? (
                    <div>
                      {user && (
                        <p className="mb-1 text-xs">
                          Comment as{' '}
                          <Link href={`/u/${user.username}`}>
                            <a className="font-semibold text-blue-500">
                              {user.username}
                            </a>
                          </Link>
                        </p>
                      )}
                      <form onSubmit={submitComment}>
                        <textarea
                          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                          onChange={(e) => setNewComment(e.target.value)}
                          value={newComment}
                        ></textarea>
                        <div className="flex justify-end">
                          <button
                            className="px-3 py-1 blue button"
                            disabled={newComment.trim() === ''}
                          >
                            Comment
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
                      <p className="font-semibold text-gray-400">
                        Log in or sign up to leave a comment
                      </p>
                      <div>
                        <Link href="/login">
                          <a className="px-4 py-1 mr-4 hollow blue button">
                            Login
                          </a>
                        </Link>
                        <Link href="/register">
                          <a className="px-4 py-1 blue button">Sign Up</a>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <hr />
                {comments?.map((comment) => (
                  <div className="flex" key={comment.identifier}>
                    <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                      <div
                        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                        onClick={() => vote(1, comment)}
                      >
                        <i
                          className={classNames('icon-arrow-up', {
                            'text-red-500': comment.userVote === 1,
                          })}
                        ></i>
                      </div>
                      <p className="text-xs font-bold">{comment.voteScore}</p>
                      <div
                        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                        onClick={() => vote(-1, comment)}
                      >
                        <i
                          className={classNames('icon-arrow-down', {
                            'text-blue-600': comment.userVote === -1,
                          })}
                        ></i>
                      </div>
                    </div>
                    <div className="py-2 pr-2">
                      <p className="mb-1 text-xs leading-none">
                        <Link href={`/u/${comment.username}`}>
                          <a className="mr-1 font-bold hover:underline">
                            {comment.username}
                          </a>
                        </Link>
                        <span className="text-gray-600">
                          {`
                            ${comment.voteScore}
                            points •
                            ${dayjs(comment.createdAt).fromNow()}
                          `}
                        </span>
                      </p>
                      <p>{comment.body}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        {/* Sidebar */}
        {post && post.sub && <Sidebar sub={post.sub} />}
      </div>
    </>
  );
};

export default PostPage;
