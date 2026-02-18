import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: App });

function App() {
  const components: { title: string; to: string }[] = [
    { title: 'Button', to: '/button' as const },
    { title: 'Accordion', to: '/accordion' as const },
    { title: 'Action Sheet', to: '/action-sheet' as const },
    { title: 'Avatar', to: '/avatar' as const },
    { title: 'Cascader', to: '/cascader' as const },
    { title: 'Calendar', to: '/calendar' as const },
    { title: 'Card', to: '/card' as const },
    { title: 'Collapse', to: '/collapse' as const },
    { title: 'Checkbox', to: '/checkbox' as const },
    { title: 'Field', to: '/field' as const },
    { title: 'Image', to: '/image' as const },
    { title: 'Input', to: '/input' as const },
    { title: 'Textarea', to: '/textarea' as const },
    { title: 'Radio', to: '/radio' as const },
    { title: 'Switch', to: '/switch' as const },
    { title: 'Swipe Action', to: '/swipe-action' as const },
    { title: 'Skeleton', to: '/skeleton' as const },
    { title: 'Steps', to: '/steps' as const },
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
    { title: 'Timeline', to: '/timeline' as const },
    { title: 'Tour', to: '/tour' as const },
    { title: 'Scrollbox', to: '/scrollbox' as const },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="px-6 pt-10 pb-6">
        <div className="flex items-center gap-3">
          <img className="h-12 w-12" src="/srcube.png" alt="Srcube UI logo" />
          <div>
            <div className="text-lg font-semibold">
              Srcube UI <span className="text-slate-500">react web</span>
            </div>
            <div className="text-xs text-slate-500">
              用于验证 React Web 端组件实现的精简示例
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4">
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
