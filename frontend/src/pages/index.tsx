import Head from 'next/head';
import PostCard from 'components/PostCard';
import { IPost } from 'types';
import useSWR from 'swr';

export default function Home(): JSX.Element {
  const { data } = useSWR<IPost[]>('/posts');
  const posts = data || [];

  return (
    <>
      <Head>
        <title>readit: the front page of the internet</title>
      </Head>
      <div className="container flex pt-5">
        <div className="w-160">
          {posts.map((post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
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
