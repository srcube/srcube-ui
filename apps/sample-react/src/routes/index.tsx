import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: App });

function App() {
  const components: { title: string; to: string }[] = [
    { title: 'Button', to: '/button' as const },
    { title: 'Checkbox', to: '/checkbox' as const },
    { title: 'Radio', to: '/radio' as const },
    { title: 'Modal', to: '/modal' as const },
    { title: 'Scrollbox', to: '/scrollbox' as const },
  ];

  return (
    <main className="min-h-dvh px-4 py-6">
      <div className="text-xl font-bold text-center">Srcube UI</div>
      <div className="mt-6 text-xs font-bold uppercase text-slate-500">
        Components
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {components.map((item) => (
          <Link
            key={item.title}
            to={item.to}
            className="flex justify-center rounded-lg bg-white py-2 font-medium shadow-sm active:bg-slate-200"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </main>
  );
}
