import { LogOut, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLogoutUser } from '../../queries/auth';

export default function DashboardHeader() {
  const { user, clearAuth } = useAuth();
  const navigate = useNavigate();
  const { mutate: logoutUser, isPending } = useLogoutUser();

  const leaveSession = () => {
    clearAuth();
    navigate('/login');
  };

  const handleLogout = () => {
    logoutUser(undefined, {
      onSuccess: () => {
        leaveSession();
      },
      onError: () => {
        // Still clear local auth so the user can leave even if server logout fails.
        leaveSession();
      },
    });
  };

  return (
    <header className='flex items-center justify-between border-b border-app-border bg-app-bg/80 px-6 py-4 backdrop-blur'>
      <div>
        <p className='text-sm text-app-muted'>Welcome back</p>
        <h2 className='text-xl font-semibold text-app-text'>
          {user?.username ?? 'Dashboard'}
        </h2>
      </div>

      <div className='flex items-center gap-3'>
        <div className='hidden items-center gap-2 rounded-xl border border-app-border bg-app-card px-3 py-2 md:flex'>
          <Search className='h-4 w-4 text-app-muted' />
          <input
            type='text'
            placeholder='Search documents...'
            className='w-48 bg-transparent text-sm text-app-text outline-none placeholder:text-app-muted'
          />
        </div>

        <button
          type='button'
          onClick={handleLogout}
          disabled={isPending}
          className='cursor-pointer rounded-xl border border-app-border px-4 py-2 text-sm font-medium text-app-muted transition hover:bg-app-card hover:text-app-text disabled:cursor-not-allowed disabled:opacity-50'
        >
          <span className='hidden sm:inline'>
            {isPending ? 'Logging out...' : 'Logout'}
          </span>
          <LogOut className='h-4 w-4 sm:hidden' />
        </button>
      </div>
    </header>
  );
}
