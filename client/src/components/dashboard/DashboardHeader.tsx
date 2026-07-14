import { LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLogoutUser } from '../../queries/auth';

const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-1.5 text-xs font-medium transition ${
    isActive
      ? 'bg-app-card text-app-text'
      : 'text-app-muted hover:bg-app-card hover:text-app-text'
  }`;

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
    <header className='border-b border-app-border bg-app-bg/80 backdrop-blur'>
      <div className='flex items-center justify-between px-6 py-4'>
        <div>
          <p className='text-sm text-app-muted'>Welcome back</p>
          <h2 className='text-xl font-semibold text-app-text'>
            {user?.username ?? 'Dashboard'}
          </h2>
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

      {/* Compact nav for viewports where the sidebar is hidden */}
      <nav className='flex gap-1 overflow-x-auto px-6 pb-3 lg:hidden'>
        <NavLink to='/dashboard' end className={mobileNavLinkClasses}>
          Documents
        </NavLink>
        <NavLink to='/dashboard/new-source' className={mobileNavLinkClasses}>
          New source
        </NavLink>
        <NavLink to='/dashboard/ask' className={mobileNavLinkClasses}>
          Ask
        </NavLink>
        <NavLink to='/dashboard/settings' className={mobileNavLinkClasses}>
          Settings
        </NavLink>
      </nav>
    </header>
  );
}
