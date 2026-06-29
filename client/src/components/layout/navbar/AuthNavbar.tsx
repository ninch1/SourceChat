import { Link } from 'react-router-dom';

export default function AuthNavbar() {
  return (
    <header className='relative z-10 mx-auto flex max-w-6xl items-center justify-between'>
      <Link to='/' className='text-lg font-bold tracking-tight'>
        <span className='text-emerald-400'>Source</span>
        <span className='text-app-text'>Chat</span>
      </Link>

      <Link
        to='/'
        className='text-sm font-medium text-app-muted transition hover:text-app-text'
      >
        Back to home
      </Link>
    </header>
  );
}
