import type { ReactNode } from 'react';

export function StoryPage({ children }: { children: ReactNode }) {
  return <main className="min-h-full bg-transparent">{children}</main>;
}

export function StorySection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      {description ? (
        <div className="mt-1 text-xs text-slate-500">{description}</div>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-3">{children}</div>
    </section>
  );
}

export function StoryStack({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>;
}
