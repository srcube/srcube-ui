import PageHeader from '@/components/page-header';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/button')({
  component: ButtonDemo,
});

function ButtonDemo() {

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 pb-24">
      <PageHeader title="Button" />
      <div className='flex justify-center p-4'>
        Button not implemented yet.
      </div>
    </main>
  );
}
