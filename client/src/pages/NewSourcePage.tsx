import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import NewSourceForm from '../components/dashboard/NewSourceForm';

export default function NewSourcePage() {
  const navigate = useNavigate();

  const goToDashboard = () => navigate('/dashboard');

  return (
    <div className='min-h-screen bg-app-bg text-app-text'>
      <div className='flex min-h-screen'>
        <DashboardSidebar />

        <div className='flex min-h-screen flex-1 flex-col'>
          <DashboardHeader />

          <main className='flex-1 px-6 py-8'>
            <div className='mx-auto max-w-3xl'>
              <div className='mb-8'>
                <p className='text-sm font-medium text-emerald-400'>
                  Paste text
                </p>

                <h1 className='mt-2 text-3xl font-semibold tracking-tight text-app-text'>
                  Add source
                </h1>

                <p className='mt-2 max-w-2xl text-sm leading-6 text-app-muted'>
                  Add a source by pasting text. We&apos;ll process it so you can
                  ask questions with citations from your own material.
                </p>
              </div>

              <div className='rounded-3xl border border-app-border bg-app-surface/70 p-6 shadow-sm sm:p-8'>
                <NewSourceForm
                  onCancel={goToDashboard}
                  onSuccess={goToDashboard}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
