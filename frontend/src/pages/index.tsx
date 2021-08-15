import { useEffect, useState, useCallback, useMemo } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import PostCard from 'components/PostCard';
import { IPost, ISub } from 'types';
import useSWR, { useSWRInfinite } from 'swr';
import Link from 'next/link';
import { useAuthState } from '../context/auth';

export default function Home(): JSX.Element {
  const [observedPost, setObservedPost] = useState('');
  const { data: topSubs } = useSWR<ISub[]>('/misc/top-subs');
  const { authenticated } = useAuthState();

  const {
    data,
    isValidating,
    size: page,
    setSize: setPage,
    revalidate,
  } = useSWRInfinite((index) => `/posts?page=${index}`);

  const observeElement = useCallback(
    (element: HTMLElement) => {
      if (!element) return;
      const observer = new IntersectionObserver(
        (entries) => {
          if (!!entries[0].isIntersecting) {
            setPage(page + 1);
            observer.unobserve(element);
          }
        },
        { threshold: 1 },
      );
      observer.observe(element);
    },
    [page, setPage],
  );

  const posts: IPost[] = useMemo(
    () => (data ? [].concat(...data) : []),
    [data],
  );

  useEffect(() => {
    const postsLength = (posts && posts.length) || 0;
    if (!posts || !postsLength) return;
    const id = posts[postsLength - 1].identifier;
    if (id !== observedPost) {
      setObservedPost(id);
      const element = document.querySelector(`#${id}`)! as HTMLElement;
      observeElement(element);
    }
  }, [observedPost, posts, observeElement]);

  return (
    <>
      <Head>
        <title>readit: the front page of the internet</title>
      </Head>
      <div className="container flex pt-5">
        <div className="w-full px-4 md:w-160 md:p-0">
          {isValidating && <p className="text-lg text-center">Loading..</p>}
          {posts?.map((post) => (
            <PostCard
              post={post}
              key={post.identifier}
              voteCallBack={revalidate}
            />
          ))}
          {isValidating && !!posts.length && (
            <p className="text-lg text-center">Loading..</p>
          )}
        </div>
        <div className="hidden ml-6 md:block w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top Communities
              </p>
            </div>
            <div>
              {topSubs?.map((sub: ISub) => (
                <div
                  key={sub.name}
                  className="flex items-center px-4 py-2 text-xs border-b"
                >
                  <Link href={`/r/${sub.name}`}>
                    <a>
                      <Image
                        src={sub.imageUrl}
                        alt="Sub"
                        width={(6 * 16) / 4}
                        height={(6 * 16) / 4}
                        className="rounded-full cursor-pointer"
                      />
                    </a>
                  </Link>
                  <Link href={`/r/${sub.name}`}>
                    <a className="ml-2 font-bold hover:cursor-pointer">
                      /r/{sub.name}
                    </a>
                  </Link>
                  <p className="ml-auto font-med">{sub.postCount}</p>
                </div>
              ))}
            </div>
            {authenticated && (
              <div className="p-4 border-t-2">
                <Link href="/subs/create">
                  <a className="w-full px-2 py-1 blue button">
                    Create Community
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
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
