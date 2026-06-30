import AuthNavbar from '../components/layout/navbar/AuthNavbar';
import { Link } from 'react-router-dom';
import { useRegisterUser } from '../queries/auth';
import { useState } from 'react';
import type { RegisterUserData } from '../types/auth';

export default function RegisterPage() {
  const [userData, setUserData] = useState<RegisterUserData>({
    email: '',
    username: '',
    password: '',
  });

  const {
    mutate: registerUserMutation,
    data,
    error,
    isPending,
    isSuccess,
    isError,
  } = useRegisterUser();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    registerUserMutation(userData);
  }

  return (
    <main className='relative min-h-screen overflow-hidden bg-app-bg px-6 py-8 text-app-text'>
      <div className='pointer-events-none absolute left-1/2 top-[-160px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl' />
      <div className='pointer-events-none absolute bottom-[-160px] right-[-120px] h-[360px] w-[360px] rounded-full bg-teal-500/10 blur-3xl' />

      <AuthNavbar />

      <section className='relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center py-12'>
        {isSuccess ? (
          <div className='w-full max-w-md rounded-3xl border border-emerald-500/20 bg-app-surface/70 p-8 shadow-2xl shadow-emerald-950/20 backdrop-blur'>
            <div className='text-center'>
              <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30'>
                <span className='text-2xl text-emerald-400'>✓</span>
              </div>

              <p className='mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400'>
                Account created
              </p>

              <h1 className='mt-4 text-3xl font-bold tracking-tight text-app-text'>
                Welcome to SourceChat
              </h1>

              <p className='mt-3 text-sm leading-6 text-app-muted'>
                Your account has been created successfully. You can now log in
                and start uploading your documents.
              </p>

              <Link
                to='/login'
                className='mt-8 inline-flex w-full items-center justify-center rounded-xl bg-app-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-app-primary-hover'
              >
                Go to login
              </Link>
            </div>
          </div>
        ) : (
          <div className='w-full max-w-md rounded-3xl border border-app-border bg-app-surface/70 p-8 shadow-2xl shadow-emerald-950/20 backdrop-blur'>
            <div className='text-center'>
              <p className='text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400'>
                Create account
              </p>

              <h1 className='mt-4 text-3xl font-bold tracking-tight text-app-text'>
                Start using SourceChat
              </h1>

              <p className='mt-3 text-sm leading-6 text-app-muted'>
                Create an account to upload documents and ask questions grounded
                in your own sources.
              </p>
            </div>

            <form className='mt-8 space-y-5' onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor='username'
                  className='mb-2 block text-sm font-medium text-app-text'
                >
                  Username
                </label>
                <input
                  value={userData.username}
                  onChange={(e) =>
                    setUserData({ ...userData, username: e.target.value })
                  }
                  id='username'
                  name='username'
                  type='text'
                  autoComplete='username'
                  placeholder='elguja'
                  className='w-full rounded-xl border border-app-border bg-app-bg/70 px-4 py-3 text-sm text-app-text outline-none transition placeholder:text-app-muted focus:border-emerald-500/70 focus:ring-4 focus:ring-emerald-500/10'
                />
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='mb-2 block text-sm font-medium text-app-text'
                >
                  Email
                </label>
                <input
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  placeholder='you@example.com'
                  className='w-full rounded-xl border border-app-border bg-app-bg/70 px-4 py-3 text-sm text-app-text outline-none transition placeholder:text-app-muted focus:border-emerald-500/70 focus:ring-4 focus:ring-emerald-500/10'
                />
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='mb-2 block text-sm font-medium text-app-text'
                >
                  Password
                </label>
                <input
                  value={userData.password}
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='new-password'
                  placeholder='Create a password'
                  className='w-full rounded-xl border border-app-border bg-app-bg/70 px-4 py-3 text-sm text-app-text outline-none transition placeholder:text-app-muted focus:border-emerald-500/70 focus:ring-4 focus:ring-emerald-500/10'
                />
              </div>

              {isError && (
                <div className='rounded-xl bg-red-400/10 p-4 text-center text-sm text-red-500'>
                  {error ? error.message : 'Unknown error'}
                </div>
              )}

              {isPending ? (
                <button
                  type='button'
                  disabled
                  className='w-full rounded-xl bg-app-primary px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-50'
                >
                  Creating account...
                </button>
              ) : (
                <button
                  type='submit'
                  className='w-full rounded-xl bg-app-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-app-primary-hover'
                >
                  Create account
                </button>
              )}
            </form>

            <p className='mt-6 text-center text-sm text-app-muted'>
              Already have an account?{' '}
              <Link
                to='/login'
                className='font-medium text-emerald-400 transition hover:text-emerald-300'
              >
                Log in
              </Link>
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
