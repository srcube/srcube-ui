import { Tabs } from '@srcube-ui/react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

const zoomItems = [
  { label: '60%', value: '0.6' },
  { label: '75%', value: '0.75' },
  { label: '100%', value: '1' },
] as const;

function usePreviewZoom() {
  const [zoom, setZoom] = useState('0.75');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const saved = window.localStorage.getItem('srcube-storybook-preview-zoom');
    if (saved === '0.6' || saved === '0.75' || saved === '1') {
      setZoom(saved);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem('srcube-storybook-preview-zoom', zoom);
  }, [zoom]);

  return { zoom, setZoom };
}

function usePreviewClock() {
  const [timeText, setTimeText] = useState('9:41');

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false,
    });

    const updateTime = () => {
      setTimeText(formatter.format(new Date()));
    };

    updateTime();
    const timer = window.setInterval(updateTime, 60_000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return timeText;
}

export function MobilePreviewFrame({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const { zoom, setZoom } = usePreviewZoom();
  const timeText = usePreviewClock();
  const scale = Number(zoom);

  const frameStyle = useMemo(
    () => ({
      transform: `scale(${scale})`,
      transformOrigin: 'top center',
    }),
    [scale],
  );

  const phoneHeight = useMemo(() => (2622 / 1206) * 390, []);
  const frameOuterSize = useMemo(() => 390 + 16, []);
  const frameOuterRadius = useMemo(() => 58, []);
  const scaledHeight = useMemo(
    () => `${(phoneHeight + 16) * scale}px`,
    [phoneHeight, scale],
  );

  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div className="mx-auto flex min-h-dvh w-full justify-center px-4 py-6 pb-24">
        <div className="w-full max-w-[406px] overflow-hidden" style={{ height: scaledHeight }}>
          <div style={frameStyle}>
            <div
              className="inline-flex bg-black p-[8px] shadow-[0_24px_60px_rgba(15,23,42,0.18),0_8px_24px_rgba(15,23,42,0.10)]"
              style={{ width: `${frameOuterSize}px`, borderRadius: `${frameOuterRadius}px` }}
            >
              <div
                className="w-[390px] shrink-0 overflow-hidden rounded-[50px] bg-[linear-gradient(165deg,#f6f9ff_0%,#fefefe_100%)] [aspect-ratio:1206/2622]"
                style={{ height: `${phoneHeight}px` }}
              >
                <div className="relative isolate flex h-full flex-col overflow-hidden rounded-[50px] [transform:translateZ(0)]">
                  <div className="shrink-0 bg-white px-10 pt-3 pb-2">
                    <div className="flex items-start justify-between text-[13px] font-semibold tracking-[0.01em] text-slate-900">
                      <span>{timeText}</span>
                      <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-slate-700">
                        SRCUBE UI
                      </span>
                    </div>
                  </div>

                  <div className="flex h-12 shrink-0 items-center justify-center border-b border-[#d8e3ef] bg-white px-4 text-center text-[15px] font-bold text-[#173552]">
                    {title ?? 'Preview'}
                  </div>

                  <div className="min-h-0 flex-1 overflow-auto p-4 pb-10">{children}</div>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pt-2 pb-4">
                    <div className="mx-auto h-1.5 w-32 rounded-full bg-slate-900/90" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed right-4 bottom-4 z-20 w-[220px]">
        <Tabs
          items={zoomItems.map((item) => ({ label: item.label, value: item.value }))}
          value={zoom}
          onValueChange={(value) => {
            setZoom(String(value));
          }}
          size="sm"
          color="default"
          classNames={{
            indicator: 'bg-slate-900 shadow-none',
            tab: 'text-slate-600 aria-selected:text-white',
            tabLabel: 'text-inherit',
          }}
        />
      </div>
    </div>
  );
}
