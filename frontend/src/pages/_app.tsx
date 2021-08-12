import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Navbar from 'components/Navbar';
import 'styles/tailwind.css';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const { pathname } = useRouter();
  const authRoute = ['/register', '/login'].includes(pathname);
  return (
    <>
      {!authRoute && <Navbar />}
      <Component {...pageProps} />
    </>
  );
}
export default MyApp;
