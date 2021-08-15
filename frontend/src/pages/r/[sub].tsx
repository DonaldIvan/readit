/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createRef, ReactNode, useState, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR from 'swr';
import PostCard from 'components/PostCard';
import { ISub } from 'types';
import { useAuthState } from 'context/auth';
import { uploadImageSub } from 'services/SubService';
import classes from 'classnames';

enum IMAGE_TYPE {
  IMAGE = 'image',
  BANNER = 'banner',
}

const Sub = (): JSX.Element => {
  const { authenticated, user } = useAuthState();
  const [ownSub, setOwnSub] = useState(false);
  const router = useRouter();
  const fileInputRef = createRef<HTMLInputElement>();
  const subname = router.query.sub;
  const {
    data: sub,
    error,
    revalidate,
  } = useSWR<ISub>(subname ? `/subs/${subname}` : null);

  const openFileInput = (type: IMAGE_TYPE) => {
    if (!ownSub) return;
    fileInputRef.current!.name = type;
    fileInputRef.current!.click();
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!sub) return;
    const file = event.target.files![0];

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', fileInputRef.current!.name);
    try {
      await uploadImageSub(formData, sub.name);
      revalidate();
    } catch (error) {}
  };

  useEffect(() => {
    if (!sub) return;
    setOwnSub(authenticated && user?.username === sub.username);
  }, [sub, authenticated, user]);

  error && router.push('/');
  let bannerUrl = '';
  let display: ReactNode;
  if (!sub) {
    display = <p className="text-ls-center">Loading...</p>;
  } else if (sub.posts && sub.posts.length === 0) {
    display = <p className="text-lg text-center">No posts submitted yet</p>;
  } else {
    display = sub.posts.map((post) => (
      <PostCard post={post} key={post.identifier} />
    ));
    bannerUrl = sub.bannerUrl;
  }
  return (
    <>
      <Head>
        <title>{sub?.title}</title>
      </Head>
      {sub && (
        <>
          <input
            type="file"
            hidden={true}
            ref={fileInputRef}
            onChange={uploadImage}
          />
          <div
            onClick={() => openFileInput(IMAGE_TYPE.BANNER)}
            className={classes('bg-blue-500', { 'cursor-pointer': ownSub })}
          >
            {bannerUrl && (
              <div
                className="h-56 bg-blue-500"
                style={{
                  backgroundImage: `url(${bannerUrl})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              ></div>
            )}
            {!bannerUrl && <div className="h-20 bg-blue-500"></div>}
          </div>
          <div className="h-20 bg-white">
            <div className="container relative flex">
              <div className="absolute" style={{ top: -10 }}>
                <Image
                  src={sub.imageUrl}
                  alt={sub.name}
                  className={classes('rounded-full', {
                    'cursor-pointer': ownSub,
                  })}
                  height={70}
                  width={70}
                  onClick={() => openFileInput(IMAGE_TYPE.IMAGE)}
                />
              </div>

              <div className="pt-1 pl-24">
                <div className="flex items-center">
                  <h1 className="mb-1 text-3xl font-bold">{sub.title}</h1>
                </div>
                <p className="text-sm font-bold text-gray-500">{sub.name}</p>
              </div>
            </div>
          </div>
          <div className="container flex pt-5">
            <div className="w-160">{display}</div>
          </div>
        </>
      )}
    </>
  );
};

export default Sub;
