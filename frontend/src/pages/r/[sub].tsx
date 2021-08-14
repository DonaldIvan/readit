import { useRouter } from 'next/router';
import useSWR from 'swr';
import PostCard from 'components/PostCard';

const Sub = (): JSX.Element => {
  const router = useRouter();
  const subname = router.query.sub;
  const { data: sub, error } = useSWR(subname ? `/subs/${subname}` : null);
  error && router.push('/');
  console.log(sub);
  let display: JSX.Element;
  if (!sub) {
    display = <p className="text-ls-center">Loading...</p>;
  } else if (sub.posts && sub.posts.length === 0) {
    display = <p className="text-lg text-center">No posts submitted yet</p>;
  } else {
    display = sub.posts.map((post) => (
      <PostCard post={post} key={post.identifier} />
    ));
  }
  return (
    <div className="container flex pt-5">
      <div className="w-160">{display}</div>
    </div>
  );
};

export default Sub;
