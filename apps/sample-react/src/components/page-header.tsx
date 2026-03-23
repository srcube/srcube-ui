import { Navbar } from '@srcube-ui/react';

type PageHeaderProps = {
  title: string;
  tone?: 'default' | 'dark';
};

export default function PageHeader({
  title,
  tone = 'default',
}: PageHeaderProps) {
  return (
    <Navbar className="sticky top-0 z-20" title={title} tone={tone} withBack />
  );
}
