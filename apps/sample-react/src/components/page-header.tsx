import { Link } from '@tanstack/react-router';

type PageHeaderProps = {
  title: string;
};

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
      <Link
        to="/"
        className="inline-flex h-8 w-8 items-center justify-center text-slate-600 hover:text-slate-900"
        aria-label="返回上一页"
      >
        <span className="icon-[ion--chevron-back] text-xl" aria-hidden />
      </Link>
      <div className="text-lg font-semibold text-slate-900">{title}</div>
    </div>
  );
}
