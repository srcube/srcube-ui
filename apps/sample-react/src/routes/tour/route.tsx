import { Button, ButtonGroup, Tour } from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import type React from 'react';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/tour')({
  component: TourDemo,
});

type TourTone = 'default' | 'dark';

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      {description ? (
        <div className="mt-1 text-xs text-slate-500">{description}</div>
      ) : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function TourDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tone, setTone] = useState<TourTone>('default');
  const [lastEvent, setLastEvent] = useState('idle');

  const steps = useMemo(
    () => [
      {
        selector: '#tour-target-search',
        title: 'Search',
        description: 'Use this input to quickly locate records.',
        placement: 'bottom' as const,
        radius: 16,
      },
      {
        selector: '#tour-target-filter',
        title: 'Filter',
        description: 'Switch status and tags with one tap.',
        placement: 'bottom' as const,
        radius: 16,
      },
      {
        selector: '#tour-target-list',
        title: 'List',
        description: 'Long content area supports auto scroll positioning.',
        placement: 'top' as const,
        radius: 16,
      },
      {
        selector: '#tour-target-submit',
        title: 'Submit',
        description: 'Final action button near page bottom.',
        placement: 'top' as const,
        radius: 16,
      },
    ],
    [],
  );

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Tour" />
      <div className="px-4 pb-8">
        <Section
          title="Controls"
          description="open tour / open from step / tone"
        >
          <div className="flex flex-wrap gap-2">
            <Button
              onTap={() => {
                setCurrentStep(0);
                setIsOpen(true);
              }}
            >
              Start Tour
            </Button>
            <Button
              variant="outline"
              onTap={() => {
                setCurrentStep(2);
                setIsOpen(true);
              }}
            >
              Start from Step 3
            </Button>
          </div>

          <div className="mt-3">
            <ButtonGroup size="sm" isBlock>
              <Button
                color={tone === 'default' ? 'primary' : 'default'}
                variant={tone === 'default' ? 'solid' : 'flat'}
                onTap={() => {
                  setTone('default');
                }}
              >
                default
              </Button>
              <Button
                color={tone === 'dark' ? 'primary' : 'default'}
                variant={tone === 'dark' ? 'solid' : 'flat'}
                onTap={() => {
                  setTone('dark');
                }}
              >
                dark
              </Button>
            </ButtonGroup>
          </div>

          <div className="mt-2 text-xs text-slate-500">
            Step: {currentStep + 1} / {steps.length} · Event: {lastEvent}
          </div>
        </Section>

        <Section
          title="Targets"
          description="scroll down to test auto scroll to bottom target"
        >
          <div className="space-y-3">
            <div
              id="tour-target-search"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              Search Input Area
            </div>
            <div
              id="tour-target-filter"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              Filter Group Area
            </div>
            <div
              id="tour-target-list"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              List Container Header
            </div>
          </div>

          <div className="mt-4 h-[520px] rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-xs text-slate-500">
            Placeholder content to create scroll distance.
          </div>

          <div
            id="tour-target-submit"
            className="mt-4 rounded-xl bg-primary px-3 py-2 text-sm text-white"
          >
            Submit Button Area
          </div>
        </Section>
      </div>

      <Tour
        isOpen={isOpen}
        currentStep={currentStep}
        steps={steps}
        tone={tone}
        canBackdropClose={false}
        canMaskClose
        onOpenChange={(nextOpen, detail) => {
          setIsOpen(nextOpen);
          setLastEvent(detail.reason);
        }}
        onStepChange={(stepIndex) => {
          setCurrentStep(stepIndex);
        }}
        onSkip={() => {
          setLastEvent('skip');
        }}
        onFinish={() => {
          setLastEvent('finish');
        }}
      />
    </main>
  );
}
