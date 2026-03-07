import { Calendar, CalendarRange } from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/calendar')({
  component: CalendarDemo,
});

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">{children}</section>
  );
}

function CalendarDemo() {
  const [singleValue, setSingleValue] = useState('2026-02-18');
  const [rangeValue, setRangeValue] = useState({
    start: '2026-02-10',
    end: '2026-02-18',
  });

  return (
    <main className="min-h-screen bg-slate-100 pb-safe-4 text-slate-900">
      <PageHeader title="Calendar" />

      <div className="space-y-6 p-4">
        <Card>
          <div className="text-sm font-semibold">Single</div>
          <div className="mt-3">
            <Calendar
              value={singleValue}
              onValueChange={setSingleValue}
              minDate="1900-01-01"
              maxDate="2099-12-31"
              disabledDates={['2026-01-09', '2026-02-20', '2026-03-12']}
              helperText={`Selected: ${singleValue}`}
            />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Range</div>
          <div className="mt-3">
            <CalendarRange
              value={rangeValue}
              color="secondary"
              minDate="1900-01-01"
              maxDate="2099-12-31"
              onValueChange={(next) => {
                setRangeValue({
                  start: next.start ?? '',
                  end: next.end ?? '',
                });
              }}
            />
          </div>
        </Card>
      </div>
    </main>
  );
}
