import React, { useState, FormEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Input from 'components/Input';
import { useRouter } from 'next/router';

import { login } from 'services/AuthService';

type RegError = {
  [key: string]: string;
};

const Login = (): JSX.Element => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<RegError>({});
  const router = useRouter();

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login({
        username,
        password,
      });
      router.push('/');
    } catch (error) {
      setErrors(error);
    }
  };

  return (
    <div className="flex bg-white">
      <Head>
        <title>Login</title>
      </Head>

      <div
        className="h-screen bg-center bg-cover w-36"
        style={{
          backgroundImage: "url('images/bricks.jpg')",
        }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Login</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy.
          </p>
          <form onSubmit={submitHandler}>
            <Input
              id="username"
              type="text"
              value={username}
              error={errors.username}
              placeholder="Username"
              onInputChange={setUsername}
            />
            <Input
              id="password"
              type="password"
              value={password}
              error={errors.password}
              placeholder="Password"
              onInputChange={setPassword}
              wrapperClass="mb-0"
            />
            {errors && errors.error && (
              <small className="font-medium text-red-600">{errors.error}</small>
            )}
            <button className="w-full py-2 mt-4 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border rounded-full border-blue500">
              Login
            </button>
          </form>
          <small>
            New to Readit?
            <Link href="/register">
              <a className="ml-1 text-blue-500 uppercase">Sign up</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
