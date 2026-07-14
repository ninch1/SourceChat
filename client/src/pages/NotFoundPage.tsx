import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLoadingScreen from '../components/ui/AuthLoadingScreen';

export default function NotFoundPage() {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <AuthLoadingScreen />;
  }

  const isLoggedIn = Boolean(user);
  const primaryTo = isLoggedIn ? '/dashboard' : '/welcome';
  const primaryLabel = isLoggedIn ? 'Back to dashboard' : 'Back to welcome';

  return (
    <main className='relative flex min-h-screen items-center justify-center overflow-hidden bg-app-bg px-6 py-12 text-app-text'>
      <div className='pointer-events-none absolute left-1/2 top-[-160px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl' />
      <div className='pointer-events-none absolute bottom-[-160px] right-[-120px] h-[360px] w-[360px] rounded-full bg-teal-500/10 blur-3xl' />

      <section className='relative z-10 w-full max-w-lg rounded-3xl border border-app-border bg-app-surface/70 px-6 py-12 text-center shadow-2xl shadow-emerald-950/20 backdrop-blur sm:px-10'>
        <p className='text-sm font-medium text-emerald-400'>404</p>

        <h1 className='mt-3 text-3xl font-semibold tracking-tight text-app-text'>
          Page not found
        </h1>

        <p className='mx-auto mt-3 max-w-sm text-sm leading-6 text-app-muted'>
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>

        <div className='mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row'>
          <Link
            to={primaryTo}
            className='inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-400'
          >
            <Home className='h-4 w-4' />
            {primaryLabel}
          </Link>

          <button
            type='button'
            onClick={() => window.history.back()}
            className='inline-flex cursor-pointer items-center gap-2 rounded-xl border border-app-border px-5 py-3 text-sm font-semibold text-app-text transition hover:bg-app-card'
          >
            <ArrowLeft className='h-4 w-4' />
            Go back
          </button>
        </div>
      </section>
    </main>
  );
}
