import { Link, useNavigate } from 'react-router-dom';
import AuthNavbar from '../components/layout/navbar/AuthNavbar';
import { useLoginUser } from '../queries/auth';
import { loginSchema } from '../schemas/authSchema';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { z } from 'zod';

export default function LoginPage() {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });

  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false,
  });

  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const {
    mutate: loginUserMutation,
    error,
    isPending,
    isError,
  } = useLoginUser();

  const validationResult = loginSchema.safeParse(userData);
  const isFormValid = validationResult.success;

  const liveFieldErrors = validationResult.success
    ? {}
    : z.flattenError(validationResult.error).fieldErrors;

  const emailError = touchedFields.email
    ? liveFieldErrors.email?.[0]
    : undefined;

  const passwordError = touchedFields.password
    ? liveFieldErrors.password?.[0]
    : undefined;

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = loginSchema.safeParse(userData);

    if (!result.success) {
      setTouchedFields({
        email: true,
        password: true,
      });

      return;
    }

    loginUserMutation(result.data, {
      onSuccess: (data) => {
        setAuth({
          user: data.user,
          accessToken: data.accessToken,
        });

        navigate('/dashboard');
      },
    });
  }

  return (
    <main className='relative min-h-screen overflow-hidden bg-app-bg px-6 py-8 text-app-text'>
      <div className='pointer-events-none absolute left-1/2 top-[-160px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl' />
      <div className='pointer-events-none absolute bottom-[-160px] right-[-120px] h-[360px] w-[360px] rounded-full bg-teal-500/10 blur-3xl' />

      <AuthNavbar />

      <section className='relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center py-12'>
        <div className='w-full max-w-md rounded-3xl border border-app-border bg-app-surface/70 p-8 shadow-2xl shadow-emerald-950/20 backdrop-blur'>
          <div className='text-center'>
            <p className='text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400'>
              Welcome back
            </p>

            <h1 className='mt-4 text-3xl font-bold tracking-tight text-app-text'>
              Log in to SourceChat
            </h1>

            <p className='mt-3 text-sm leading-6 text-app-muted'>
              Continue working with your documents and source-backed answers.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className='mt-8 space-y-5'>
            <div>
              <label
                htmlFor='email'
                className='mb-2 block text-sm font-medium text-app-text'
              >
                Email
              </label>

              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                placeholder='you@example.com'
                required
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, email: true }))
                }
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? 'email-error' : undefined}
                className={`w-full rounded-xl border bg-app-bg/70 px-4 py-3 text-sm text-app-text outline-none transition placeholder:text-app-muted focus:ring-4 ${
                  emailError
                    ? 'border-red-400/70 focus:border-red-400 focus:ring-red-500/10'
                    : 'border-app-border focus:border-emerald-500/70 focus:ring-emerald-500/10'
                }`}
              />

              {emailError && (
                <p id='email-error' className='mt-2 text-sm text-red-400'>
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='password'
                className='mb-2 block text-sm font-medium text-app-text'
              >
                Password
              </label>

              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                placeholder='Enter your password'
                required
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, password: true }))
                }
                aria-invalid={Boolean(passwordError)}
                aria-describedby={passwordError ? 'password-error' : undefined}
                className={`w-full rounded-xl border bg-app-bg/70 px-4 py-3 text-sm text-app-text outline-none transition placeholder:text-app-muted focus:ring-4 ${
                  passwordError
                    ? 'border-red-400/70 focus:border-red-400 focus:ring-red-500/10'
                    : 'border-app-border focus:border-emerald-500/70 focus:ring-emerald-500/10'
                }`}
              />

              {passwordError && (
                <p id='password-error' className='mt-2 text-sm text-red-400'>
                  {passwordError}
                </p>
              )}
            </div>

            {isError && (
              <div className='rounded-xl bg-red-400/10 p-4 text-center text-sm text-red-400'>
                {error ? error.message : 'Unknown error'}
              </div>
            )}

            <button
              type='submit'
              disabled={isPending || !isFormValid}
              className='w-full cursor-pointer rounded-xl bg-app-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-app-primary-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-app-primary'
            >
              {isPending ? 'Logging in...' : 'Log in'}
            </button>

            {!isFormValid && (
              <p className='text-center text-xs text-app-muted'>
                Enter a valid email and password to continue.
              </p>
            )}
          </form>

          <p className='mt-6 text-center text-sm text-app-muted'>
            Don&apos;t have an account?{' '}
            <Link
              to='/register'
              className='font-medium text-emerald-400 transition hover:text-emerald-300'
            >
              Create one
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
