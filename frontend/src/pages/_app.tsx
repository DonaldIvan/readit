import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Navbar from 'components/Navbar';
import { SWRConfig } from 'swr';
import 'styles/tailwind.css';
import 'styles/icons.css';
import { AuthProvider } from 'context/auth';
import classes from 'classnames';
import { fetcher } from 'services/ApiClient';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const { pathname } = useRouter();
  const authRoute = ['/register', '/login'].includes(pathname);
  return (
    <SWRConfig
      value={{
        fetcher,
        dedupingInterval: 10000,
      }}
    >
      <AuthProvider>
        {!authRoute && <Navbar />}
        <div className={classes({ 'pt-12': !authRoute })}>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SWRConfig>
  );
}
export default MyApp;
