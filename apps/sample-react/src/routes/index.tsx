import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: App });

function App() {
  const components: { title: string; to: string }[] = [
    { title: 'Button', to: '/button' as const },
    { title: 'Accordion', to: '/accordion' as const },
    { title: 'Action Sheet', to: '/action-sheet' as const },
    { title: 'Avatar', to: '/avatar' as const },
    { title: 'Collapse', to: '/collapse' as const },
    { title: 'Checkbox', to: '/checkbox' as const },
    { title: 'Field', to: '/field' as const },
    { title: 'Input', to: '/input' as const },
    { title: 'Textarea', to: '/textarea' as const },
    { title: 'Radio', to: '/radio' as const },
    { title: 'Switch', to: '/switch' as const },
    { title: 'Swipe Action', to: '/swipe-action' as const },
    { title: 'Skeleton', to: '/skeleton' as const },
    { title: 'Stepper', to: '/stepper' as const },
    { title: 'Input OTP', to: '/input-otp' as const },
    { title: 'Listbox', to: '/listbox' as const },
    { title: 'Pickbox', to: '/pickbox' as const },
    { title: 'Picker', to: '/picker' as const },
    { title: 'Popover', to: '/popover' as const },
    { title: 'Notice Bar', to: '/notice-bar' as const },
    { title: 'Modal', to: '/modal' as const },
    { title: 'Navbar', to: '/navbar' as const },
    { title: 'Tabbar', to: '/tabbar' as const },
    { title: 'Drawer', to: '/drawer' as const },
    { title: 'Tabs', to: '/tabs' as const },
    { title: 'Tour', to: '/tour' as const },
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
