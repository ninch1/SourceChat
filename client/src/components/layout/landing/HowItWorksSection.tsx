const steps = [
  {
    number: '01',
    title: 'Upload or paste text',
    description:
      'Create a document from pasted text or upload a text file from your computer.',
  },
  {
    number: '02',
    title: 'SourceChat indexes it',
    description:
      'The backend splits the document into chunks and generates embeddings for semantic search.',
  },
  {
    number: '03',
    title: 'Ask questions',
    description:
      'Your question is matched with the most relevant document chunks before an AI answer is generated.',
  },
];

export default function HowItWorksSection() {
  return (
    <section id='how-it-works' className='relative px-6 py-24'>
      <div className='relative mx-auto max-w-7xl'>
        <div className='grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400'>
              How it works
            </p>

            <h2 className='mt-4 text-3xl font-bold tracking-tight text-app-text md:text-5xl'>
              From document to answer in three steps.
            </h2>

            <p className='mt-5 text-lg leading-8 text-app-muted'>
              SourceChat uses a retrieval-augmented generation flow: retrieve
              the most relevant source chunks first, then generate an answer
              grounded in those chunks.
            </p>
          </div>

          <div className='space-y-4'>
            {steps.map((step) => (
              <div
                key={step.number}
                className='rounded-3xl border border-app-border bg-app-surface/60 p-6 backdrop-blur'
              >
                <div className='flex gap-5'>
                  <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-sm font-bold text-emerald-300'>
                    {step.number}
                  </span>

                  <div>
                    <h3 className='text-lg font-semibold text-app-text'>
                      {step.title}
                    </h3>

                    <p className='mt-2 leading-7 text-app-muted'>
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
