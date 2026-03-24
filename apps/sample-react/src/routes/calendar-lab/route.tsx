import { Calendar, CalendarRange } from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/calendar-lab')({
  component: CalendarLabDemo,
});

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-200/70">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      {desc ? <div className="mt-1 text-xs text-slate-500">{desc}</div> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function CalendarLabDemo() {
  const [singleValue, setSingleValue] = useState('2026-03-24');
  const [rangeValue, setRangeValue] = useState({
    start: '2026-03-20',
    end: '2026-03-28',
  });

  const disabledDates = useMemo(
    () => ['2026-03-26', '2026-03-30', '2026-04-03'],
    [],
  );

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] pb-10 text-slate-900">
      <PageHeader title="Calendar Lab" />

      <div className="space-y-6 px-4 pb-8">
        <Section
          title="Single / Clean"
          desc="新的 Calendar 走简洁卡片 + 月份分页 + 快捷跳转，先验证单选体验。"
        >
          <Calendar
            value={singleValue}
            onValueChange={setSingleValue}
            month="2026-03"
            minDate="2026-01-01"
            maxDate="2026-12-31"
            color="primary"
            helperText={`Selected: ${singleValue}`}
            disabledDates={disabledDates}
          />
        </Section>

        <Section
          title="Range / Travel"
          desc="区间模式沿用同一渲染结构，验证范围态、首尾态、禁用态。"
        >
          <CalendarRange
            value={rangeValue}
            onValueChange={(next) => {
              setRangeValue({
                start: next.start ?? '',
                end: next.end ?? '',
              });
            }}
            month="2026-03"
            minDate="2026-01-01"
            maxDate="2026-12-31"
            color="secondary"
            disabledDates={disabledDates}
          />
        </Section>
      </div>
    </main>
  );
}
