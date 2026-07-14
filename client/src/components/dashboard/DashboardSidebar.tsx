import { FileText, MessageSquare, Plus, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
    isActive
      ? 'bg-app-card text-app-text shadow-sm'
      : 'text-app-muted hover:bg-app-card hover:text-app-text'
  }`;

export default function DashboardSidebar() {
  return (
    <aside className='hidden min-h-screen w-72 border-r border-app-border bg-app-surface/60 px-5 py-6 lg:block'>
      <div className='mb-10'>
        <h1 className='text-xl font-semibold tracking-tight text-app-text'>
          SourceChat
        </h1>
        <p className='mt-1 text-sm text-app-muted'>
          Chat with your own sources
        </p>
      </div>

      <nav className='space-y-2'>
        <NavLink to='/dashboard' end className={navLinkClasses}>
          <FileText className='h-4 w-4' />
          Documents
        </NavLink>

        <NavLink to='/dashboard/new-source' className={navLinkClasses}>
          <Plus className='h-4 w-4' />
          New source
        </NavLink>

        <NavLink to='/dashboard/ask' className={navLinkClasses}>
          <MessageSquare className='h-4 w-4' />
          Ask
        </NavLink>

        <NavLink to='/dashboard/settings' className={navLinkClasses}>
          <Settings className='h-4 w-4' />
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}
