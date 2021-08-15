import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useState, useEffect } from 'react';
import useSWR from 'swr';
import Sidebar from 'components/Sidebar';
import { ISub } from 'types';
import { postPost } from 'services/PostService';
import { useAuthState } from 'context/auth';

const Submit = (): JSX.Element => {
  const { authenticated } = useAuthState();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const router = useRouter();
  const { sub: subName } = router.query;

  const { data: sub, error } = useSWR<ISub>(
    subName ? `/subs/${subName}` : null,
  );

  error && router.push('/');

  useEffect(() => {
    !authenticated && router.push('/login');
  }, [authenticated, router]);

  const submitPost = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle || !sub) return;
    try {
      const post = await postPost({
        title: trimmedTitle,
        body,
        subName: sub.name,
      });

      router.push(`/r/${sub.name}/${post.identifier}/${post.slug}`);
    } catch (err) {}
  };

  return (
    <div className="container flex pt-5">
      <Head>
        <title>Submit to Readit</title>
      </Head>
      <div className="w-160">
        <div className="p-4 bg-white rounded">
          <h1 className="mb-3 text-lg">Submit a post to /r/{subName}</h1>
          <form onSubmit={submitPost}>
            <div className="relative mb-2">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
                placeholder="Title"
                maxLength={300}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div
                className="absolute mb-2 text-sm text-gray-500 select-none focus:border-gray-600"
                style={{ top: 11, right: 10 }}
              >
                {title.trim().length}/300
              </div>
            </div>
            <textarea
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Text (optional)"
              rows={4}
            ></textarea>
            <div className="flex justify-end">
              <button
                className="px-3 py-1 blue button"
                type="submit"
                disabled={title.trim().length === 0}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {sub && <Sidebar sub={sub} />}
    </div>
  );
};

export default Submit;
