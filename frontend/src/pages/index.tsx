import { useEffect, useState } from 'react';
import Head from 'next/head';
import PostCard from 'components/PostCard';

import { getPosts } from 'services/PostService';
import { IPost } from 'types';
// import { GetServerSideProps } from 'next';

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
          {posts.map((post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
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
