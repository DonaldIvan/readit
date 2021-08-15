import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import { useAuthState } from 'context/auth';
import { logout as logoutService } from 'services/AuthService';
import { searchSub } from 'services/SubService';

import Reddit from 'assets/reddit.svg';
import { ISub } from 'types';
import { useRouter } from 'next/router';

const Navbar = (): JSX.Element => {
  const [name, setName] = useState('');
  const [subs, setSubs] = useState<ISub[]>([]);
  const { authenticated, logout, loading } = useAuthState();
  const router = useRouter();
  const logoutHandler = async () => {
    try {
      await logoutService();
      await logout();
    } catch (error) {}
  };
  useEffect(() => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const timer = setTimeout(async () => {
      try {
        const data = await searchSub(trimmedName);
        setSubs(data);
      } catch (err) {}
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [name]);

  const goToSub = (subName: string) => {
    router.push(`/r/${subName}`);
    setName('');
  };
  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-5 bg-white">
      <div className="flex items-center">
        <Link href="/">
          <a>
            <Reddit className="w-8 h-8 mr-2" />
          </a>
        </Link>
        <span className="hidden text-2xl font-semibold lg:block">
          <Link href="/">readit</Link>
        </span>
      </div>

      <div className="max-w-full px-4 w-160">
        <div className="relative flex items-center bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
          <i className="pl-4 pr-3 text-gray-500 fas fa-search "></i>
          <input
            type="text"
            className="py-1 pr-3 bg-transparent rounded focus:outline-none"
            placeholder="Search"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div
            className="absolute left-0 right-0 bg-white"
            style={{ top: '100%' }}
          >
            {subs?.map((sub) => (
              <div
                className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
                onClick={() => goToSub(sub.name)}
                key={sub.name}
              >
                <Image
                  src={sub.imageUrl}
                  className="rounded-full"
                  alt="Sub"
                  height={(8 * 16) / 4}
                  width={(8 * 16) / 4}
                />
                <div className="ml-4 text-sm">
                  <p className="font-medium">{sub.name}</p>
                  <p className="text-gray-600">{sub.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex">
        {authenticated && !loading && (
          <button
            className="hidden w-20 py-1 mr-4 leading-5 sm:block lg:w-32 hollow blue button"
            onClick={logoutHandler}
          >
            Logout
          </button>
        )}
        {!authenticated && !loading && (
          <>
            <Link href="/login">
              <a className="hidden w-20 py-1 mr-4 leading-5 sm:block lg:w-32 hollow blue button">
                Login
              </a>
            </Link>
            <Link href="/register">
              <a className="hidden w-20 py-1 leading-5 sm:block lg:w-32 blue button">
                sign up
              </a>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
