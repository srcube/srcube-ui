import { Calendar, CalendarRange } from '@srcube-ui/calendar';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/calendar')({
  component: CalendarDemo,
});

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl bg-white p-4 shadow-sm">{children}</section>;
}

function CalendarDemo() {
  const [singleValue, setSingleValue] = useState('2026-02-18');
  const [rangeValue, setRangeValue] = useState({
    start: '2026-02-10',
    end: '2026-02-18',
  });

  return (
    <main className="min-h-screen bg-slate-100 pb-safe-4 text-slate-900">
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-4">
        <div className="text-lg font-semibold">Calendar</div>
      </div>

      <div className="space-y-6 p-4">
        <Card>
          <div className="text-sm font-semibold">Single</div>
          <div className="mt-3">
            <Calendar
              value={singleValue}
              month="2026-02"
              onValueChange={setSingleValue}
              minDate="2026-02-03"
              maxDate="2026-02-26"
              disabledDates={['2026-02-09', '2026-02-20']}
              helperText={`Selected: ${singleValue}`}
            />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Range</div>
          <div className="mt-3">
            <CalendarRange
              value={rangeValue}
              month="2026-02"
              color="secondary"
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
