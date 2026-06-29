import { Link } from 'react-router-dom';

export default function MarketingNavbar() {
  return (
    <header className='fixed left-0 right-0 top-6 z-50 px-6'>
      <nav className='mx-auto flex h-14 max-w-3xl items-center justify-between rounded-full border border-app-border/70 bg-app-surface/60 px-5 backdrop-blur-xl'>
        <Link to='/' className='text-base font-bold tracking-tight'>
          <span className='text-emerald-400'>Source</span>
          <span className='text-app-text'>Chat</span>
        </Link>

        <div className='hidden items-center gap-6 text-sm text-app-muted md:flex'>
          <a href='#features' className='transition hover:text-app-text'>
            Features
          </a>
          <a href='#how-it-works' className='transition hover:text-app-text'>
            How it works
          </a>
        </div>

        <Link
          to='/login'
          className='rounded-full border border-app-border bg-app-surface-soft/70 px-4 py-2 text-sm font-medium text-app-text transition hover:bg-app-surface-soft'
        >
          Log in
        </Link>
      </nav>
    </header>
  );
}
