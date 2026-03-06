import { Navbar } from '@srcube-ui/react';

type PageHeaderProps = {
  title: string;
};

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <Navbar
      className="sticky top-0 z-20 border-b border-slate-200"
      title={title}
      withBack
    />
  );
}
