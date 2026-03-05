import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: App });

function App() {
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

      <div className="grid grid-cols-1 gap-4 p-4">
        <Link
          to="/button"
          className="flex justify-center rounded-lg bg-white py-2 font-medium shadow-sm active:bg-slate-200"
        >
          Button
        </Link>
      </div>
    </main>
  );
}
