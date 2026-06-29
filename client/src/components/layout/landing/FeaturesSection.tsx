import { FileText, MessageCircle, SearchCheck } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Upload your own documents',
    description:
      'Add text files or paste notes directly into SourceChat and turn them into searchable knowledge.',
  },
  {
    icon: MessageCircle,
    title: 'Ask grounded questions',
    description:
      'Get answers based on your uploaded sources instead of generic AI responses.',
  },
  {
    icon: SearchCheck,
    title: 'View supporting sources',
    description:
      'Each answer can show the document chunks used, so you can verify where the response came from.',
  },
];

export default function FeaturesSection() {
  return (
    <section id='features' className='relative overflow-hidden px-6 py-24'>
      <div className='mx-auto max-w-7xl'>
        <div className='mx-auto max-w-2xl text-center'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400'>
            Features
          </p>

          <h2 className='mt-4 text-3xl font-bold tracking-tight text-app-text md:text-5xl'>
            Everything you need to chat with your sources.
          </h2>

          <p className='mt-5 text-lg leading-8 text-app-muted'>
            SourceChat keeps the experience simple: upload documents, ask
            questions, and review the sources behind each answer.
          </p>
        </div>

        <div className='mt-14 grid gap-6 md:grid-cols-3'>
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className='rounded-3xl border border-app-border bg-app-surface/70 p-6 backdrop-blur transition hover:border-emerald-500/40 hover:bg-app-surface/90'
              >
                <div className='mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300'>
                  <Icon size={22} strokeWidth={2} />
                </div>

                <h3 className='text-lg font-semibold text-app-text'>
                  {feature.title}
                </h3>

                <p className='mt-3 leading-7 text-app-muted'>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
