import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className='flex flex-col items-center text-center lg:items-start lg:text-left'>
      <span className='inline-flex rounded-full border border-app-border bg-app-surface/70 px-4 py-2 text-sm text-app-muted'>
        AI-powered document Q&amp;A
      </span>

      <h1 className='mt-6 max-w-3xl text-5xl font-bold tracking-tight text-app-text md:text-7xl'>
        Chat with your{' '}
        <span className='bg-linear-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent'>
          documents.
        </span>
      </h1>

      <p className='mt-6 max-w-xl text-lg leading-8 text-app-muted md:text-xl'>
        Turn your notes and documents into a searchable knowledge base. Upload
        text files, ask questions, and get answers grounded in your own sources.
      </p>

      <div className='mt-8 flex flex-wrap justify-center gap-4 lg:justify-start'>
        <Link
          to='/register'
          className='cursor-pointer rounded-xl bg-app-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-app-primary-hover'
        >
          Get Started
        </Link>

        <Link
          to='/login'
          className='cursor-pointer rounded-xl border border-app-border bg-app-surface/70 px-5 py-3 text-sm font-semibold text-app-text transition hover:bg-app-surface-soft'
        >
          Log In
        </Link>
      </div>

      <p className='mt-6 text-sm text-app-muted'>
        User-owned documents • Source-backed answers • Secure sessions
      </p>
    </section>
  );
}
