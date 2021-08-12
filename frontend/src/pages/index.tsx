/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { getPosts, IPost } from 'services/PostService';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
// import { GetServerSideProps } from 'next';

dayjs.extend(relativeTime);

export default function Home(): JSX.Element {
  const [posts, setPost] = useState<IPost[]>([]);
  const getLists = async () => {
    try {
      const data = await getPosts();
      setPost(data);
    } catch (error) {}
  };
  useEffect(() => {
    getLists();
  }, []);
  return (
    <div className="pt-12">
      <Head>
        <title>readit: the front page of the internet</title>
      </Head>
      <div className="container flex pt-4">
        <div className="w-160">
          {posts.map(
            ({
              identifier,
              subName,
              username,
              createdAt,
              url,
              title,
              body,
            }) => {
              const subLink = `/r/${subName}`;
              const userLink = `/u/${username}`;
              return (
                <div key={identifier} className="flex mb-4 bg-white rounded">
                  <div className="w-10 text-center bg-gray-200 rounded-l">
                    <p>v</p>
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
                          <a className="font-bold text-ts hover:underline">
                            {subLink}
                          </a>
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
                          <div className="p-1 mr-1 text-xs text-gray-400">
                            <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                            <span className="font-bold">20 comments</span>
                          </div>
                        </a>
                      </Link>
                      <div className="p-1 mr-1 text-xs text-gray-400">
                        <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                        <span className="font-bold">20 comments</span>
                      </div>
                      <div className="p-1 mr-1 text-xs text-gray-400">
                        <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                        <span className="font-bold">20 comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}

// export const getServerSideProps: GetServerSideProps = async () => {
//   try {
//     const data = await getPosts();
//     return {
//       props: { posts: data },
//     };
//   } catch (error) {
//     return {
//       props: { error: 'Something went wrong' },
//     };
//   }
// };
