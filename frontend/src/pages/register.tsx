import React, { useState, FormEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Input from 'components/Input';
import { useRouter } from 'next/router';

import { register } from 'services/AuthService';

import { useAuthState } from 'context/auth';

import { TError } from 'types';

const Register = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [errors, setErrors] = useState<TError>({});
  const router = useRouter();
  const { authenticated } = useAuthState();
  authenticated && router.push('/');

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!agreement) {
      setErrors((curr) => ({ ...curr, agreement: 'You must agree to T&Cs' }));
      return;
    }
    try {
      await register({
        email,
        username,
        password,
      });
      router.push('/login');
    } catch (error) {
      setErrors(error);
    }
  };

  return (
    <div className="flex bg-white">
      <Head>
        <title>Register</title>
      </Head>

      <div
        className="h-screen bg-center bg-cover w-36"
        style={{
          backgroundImage: "url('images/bricks.jpg')",
        }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Sign up</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy.
          </p>
          <form onSubmit={submitHandler}>
            <div className="mb-6">
              <input
                type="checkbox"
                id="agreement"
                className="mr1 curson-pointer"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
              />
              <label htmlFor="agreement" className="text-xs cursor-pointer">
                I agree to get emails about cool stuff on Reddit
              </label>
              {errors.agreement && (
                <small className="block font-medium text-red-600">
                  {errors.agreement}
                </small>
              )}
            </div>
            <Input
              id="email"
              type="email"
              value={email}
              error={errors.email}
              placeholder="Email"
              onInputChange={setEmail}
            />
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
              wrapperClass="mb-4"
            />
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border rounded-full border-blue500">
              Sign up
            </button>
          </form>
          <small>
            Already a redditor?
            <Link href="/login">
              <a className="ml-1 text-blue-500 uppercase">Log in</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Register;
