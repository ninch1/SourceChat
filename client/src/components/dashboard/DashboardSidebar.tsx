import { FileText, MessageSquare, Plus, Settings } from 'lucide-react';

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
        <button className='flex w-full cursor-pointer items-center gap-3 rounded-xl bg-app-card px-4 py-3 text-left text-sm font-medium text-app-text shadow-sm'>
          <FileText className='h-4 w-4' />
          Documents
        </button>

        <button className='flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-app-muted transition hover:bg-app-card hover:text-app-text'>
          <Plus className='h-4 w-4' />
          New source
        </button>

        <button className='flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-app-muted transition hover:bg-app-card hover:text-app-text'>
          <MessageSquare className='h-4 w-4' />
          Chats
        </button>

        <button className='flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-app-muted transition hover:bg-app-card hover:text-app-text'>
          <Settings className='h-4 w-4' />
          Settings
        </button>
      </nav>
    </aside>
  );
}
