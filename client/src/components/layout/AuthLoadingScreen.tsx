export default function AuthLoadingScreen() {
  return (
    <main className='flex min-h-screen items-center justify-center bg-app-bg px-6 text-app-text'>
      <div className='text-center'>
        <div className='mx-auto h-10 w-10 animate-spin rounded-full border-2 border-app-border border-t-emerald-400' />

        <p className='mt-4 text-sm font-medium text-app-muted'>
          Checking your session...
        </p>
      </div>
    </main>
  );
}
