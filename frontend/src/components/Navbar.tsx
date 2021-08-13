import Link from 'next/link';

import { useAuthState } from 'context/auth';
import { logout as logoutService } from 'services/AuthService';

import Reddit from 'assets/reddit.svg';

const Navbar = (): JSX.Element => {
  const { authenticated, logout, loading } = useAuthState();
  const logoutHandler = async () => {
    try {
      await logoutService();
      logout();
    } catch (error) {}
  };
  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white">
      <div className="flex items-center">
        <Link href="/">
          <a>
            <Reddit className="w-8 h-8 mr-2" />
          </a>
        </Link>
        <span className="text-2xl font-semibold">
          <Link href="/">readit</Link>
        </span>
      </div>

      <div className="flex items-center mx-auto bg-gray-100 border rounded hover:bg-white hover:border-blue-500">
        <i className="pl-4 pr-3 fas fa-search text gray-500"></i>
        <input
          type="text"
          className="py-1 pr-3 bg-transparent rounded w-160 focus:outline-none"
          placeholder="Search"
        />
      </div>
      <div className="flex">
        {authenticated && !loading && (
          <button
            className="w-32 py-1 mr-4 leading-5 hollow blue button"
            onClick={logoutHandler}
          >
            Logout
          </button>
        )}
        {!authenticated && !loading && (
          <>
            <Link href="/login">
              <a className="w-32 py-1 mr-4 leading-5 hollow blue button">
                Login
              </a>
            </Link>
            <Link href="/register">
              <a className="w-32 py-1 leading-5 blue button">Register</a>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
