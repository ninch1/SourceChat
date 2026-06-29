import { Link } from 'react-router-dom';
import AuthNavbar from '../components/layout/navbar/AuthNavbar';

export default function LoginPage() {
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

          <form className='mt-8 space-y-5'>
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
                className='w-full rounded-xl border border-app-border bg-app-bg/70 px-4 py-3 text-sm text-app-text outline-none transition placeholder:text-app-muted focus:border-emerald-500/70 focus:ring-4 focus:ring-emerald-500/10'
              />
            </div>

            <div>
              <div className='mb-2 flex items-center justify-between'>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-app-text'
                >
                  Password
                </label>

                <button
                  type='button'
                  className='cursor-pointer  text-xs font-medium text-app-muted transition hover:text-emerald-300'
                >
                  Forgot password?
                </button>
              </div>

              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                placeholder='Enter your password'
                className='w-full rounded-xl border border-app-border bg-app-bg/70 px-4 py-3 text-sm text-app-text outline-none transition placeholder:text-app-muted focus:border-emerald-500/70 focus:ring-4 focus:ring-emerald-500/10'
              />
            </div>

            <button
              type='submit'
              className='w-full rounded-xl bg-app-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-app-primary-hover'
            >
              Log in
            </button>
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
