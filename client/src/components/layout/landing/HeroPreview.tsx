export default function HeroPreview() {
  return (
    <section className="relative mx-auto w-full max-w-xl">
      <div className="absolute -inset-4 rounded-[2rem] bg-emerald-500/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-3xl border border-app-border bg-app-surface/80 p-4 shadow-2xl shadow-emerald-950/30 backdrop-blur">
        <div className="mb-4 flex items-center justify-between border-b border-app-border pb-4">
          <div>
            <p className="text-sm font-semibold text-app-text">SourceChat</p>
            <p className="text-xs text-app-muted">Knowledge base dashboard</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-app-muted">Ready</span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-3">
            <div className="rounded-2xl border border-app-border bg-app-surface-soft/70 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-app-text">Documents</p>
                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                  3 files
                </span>
              </div>

              <div className="space-y-2">
                <div className="rounded-xl border border-app-border bg-app-surface px-3 py-2">
                  <p className="text-xs font-medium text-app-text">
                    SourceChat Notes
                  </p>
                  <p className="text-xs text-app-muted">12 chunks indexed</p>
                </div>

                <div className="rounded-xl border border-app-border bg-app-surface px-3 py-2">
                  <p className="text-xs font-medium text-app-text">
                    API Design
                  </p>
                  <p className="text-xs text-app-muted">8 chunks indexed</p>
                </div>

                <div className="rounded-xl border border-app-border bg-app-surface px-3 py-2">
                  <p className="text-xs font-medium text-app-text">Auth Flow</p>
                  <p className="text-xs text-app-muted">5 chunks indexed</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-emerald-500/30 bg-emerald-500/5 p-4">
              <p className="text-sm font-medium text-emerald-200">
                Upload document
              </p>
              <p className="mt-1 text-xs text-app-muted">
                Drop a .txt file or paste text.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-app-border bg-app-surface-soft/70 p-4">
              <p className="text-sm font-medium text-app-text">
                Ask a question
              </p>

              <div className="mt-3 rounded-xl border border-app-border bg-app-surface px-3 py-3">
                <p className="text-sm text-app-text">
                  How does semantic search work?
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-app-border bg-app-surface-soft/70 p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <p className="text-sm font-medium text-app-text">Answer</p>
              </div>

              <p className="text-sm leading-6 text-app-muted">
                Semantic search compares your question with document embeddings
                and retrieves the most relevant chunks before generating a
                grounded answer.
              </p>
            </div>

            <div className="rounded-2xl border border-app-border bg-app-surface-soft/70 p-4">
              <p className="text-sm font-medium text-app-text">Sources</p>

              <div className="mt-3 space-y-2">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium text-emerald-200">
                      SourceChat Notes
                    </p>
                    <span className="text-xs text-emerald-300">0.72</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-app-muted">
                    pgvector stores embeddings and searches for similar document
                    chunks using vector distance.
                  </p>
                </div>

                <div className="rounded-xl border border-app-border bg-app-surface px-3 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium text-app-text">
                      API Design
                    </p>
                    <span className="text-xs text-app-muted">0.64</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-app-muted">
                    The answer includes sources so users can verify where the
                    response came from.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
