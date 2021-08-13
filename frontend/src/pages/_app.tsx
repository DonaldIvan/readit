import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Navbar from 'components/Navbar';
import 'styles/tailwind.css';
import 'styles/icons.css';
import { AuthProvider } from 'context/auth';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const { pathname } = useRouter();
  const authRoute = ['/register', '/login'].includes(pathname);
  return (
    <AuthProvider>
      {!authRoute && <Navbar />}
      <Component {...pageProps} />
    </AuthProvider>
  );
}
export default MyApp;
