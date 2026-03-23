import {
  Button,
  Popup,
  PopupBackdrop,
  PopupBody,
  PopupContent,
  PopupFooter,
  PopupHeader,
} from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/popup')({
  component: PopupDemo,
});

type BackdropType = 'opaque' | 'blur' | 'transparent';

function Section({
  title,
  description,
  tone,
  children,
}: {
  title: string;
  description?: string;
  tone: 'default' | 'dark';
  children: React.ReactNode;
}) {
  return (
    <section
      className={[
        'mt-6 rounded-2xl p-4 shadow-sm transition-colors duration-200',
        tone === 'dark'
          ? 'bg-zinc-900 text-zinc-50 shadow-black/20'
          : 'bg-white text-slate-900',
      ].join(' ')}
    >
      <div className="text-sm font-semibold">{title}</div>
      {description ? (
        <div
          className={[
            'mt-1 text-xs',
            tone === 'dark' ? 'text-zinc-400' : 'text-slate-500',
          ].join(' ')}
        >
          {description}
        </div>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-3">{children}</div>
    </section>
  );
}

function PopupDemo() {
  const [tone, setTone] = useState<'default' | 'dark'>('default');
  const [basicOpen, setBasicOpen] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [backdropValue, setBackdropValue] = useState<BackdropType>('opaque');
  const [lockedOpen, setLockedOpen] = useState(false);
  const [noBackdropOpen, setNoBackdropOpen] = useState(false);

  return (
    <main
      className={[
        'min-h-screen pb-24 transition-colors duration-200',
        tone === 'dark'
          ? 'bg-zinc-950 text-zinc-50'
          : 'bg-slate-100 text-slate-900',
      ].join(' ')}
    >
      <PageHeader title="Popup" tone={tone} />
      <div className="px-4 pb-8">
        <Section title="Tone" tone={tone}>
          <Button
            size="sm"
            color={tone === 'default' ? 'primary' : 'default'}
            variant={tone === 'default' ? 'solid' : 'flat'}
            onTap={() => setTone('default')}
          >
            default
          </Button>
          <Button
            size="sm"
            tone="dark"
            variant={tone === 'dark' ? 'solid' : 'flat'}
            onTap={() => setTone('dark')}
          >
            dark
          </Button>
        </Section>

        <Section title="Basic" description="default popup" tone={tone}>
          <Button
            tone={tone === 'dark' ? 'dark' : 'light'}
            onTap={() => setBasicOpen(true)}
          >
            Open Popup
          </Button>
        </Section>

        <Section
          title="Backdrop"
          description="opaque / blur / transparent"
          tone={tone}
        >
          <Button
            tone={tone === 'dark' ? 'dark' : 'light'}
            variant="outline"
            onTap={() => {
              setBackdropValue('opaque');
              setBackdropOpen(true);
            }}
          >
            Opaque
          </Button>
          <Button
            tone={tone === 'dark' ? 'dark' : 'light'}
            variant="outline"
            onTap={() => {
              setBackdropValue('blur');
              setBackdropOpen(true);
            }}
          >
            Blur
          </Button>
          <Button
            tone={tone === 'dark' ? 'dark' : 'light'}
            variant="outline"
            onTap={() => {
              setBackdropValue('transparent');
              setBackdropOpen(true);
            }}
          >
            Transparent
          </Button>
        </Section>

        <Section title="Non Dismissable" tone={tone}>
          <Button
            tone={tone === 'dark' ? 'dark' : 'light'}
            onTap={() => setLockedOpen(true)}
          >
            Open Locked
          </Button>
        </Section>

        <Section title="No Backdrop" tone={tone}>
          <Button
            tone={tone === 'dark' ? 'dark' : 'light'}
            onTap={() => setNoBackdropOpen(true)}
          >
            Open Popup
          </Button>
        </Section>
      </div>

      <Popup isOpen={basicOpen} tone={tone} onOpenChange={setBasicOpen}>
        <PopupBackdrop />
        <PopupContent>
          <PopupHeader>Basic Popup</PopupHeader>
          <PopupBody className="min-h-24">
            This is a basic popup message.
          </PopupBody>
          <PopupFooter>
            <Button
              tone={tone === 'dark' ? 'dark' : 'light'}
              variant="text"
              onTap={() => setBasicOpen(false)}
            >
              Cancel
            </Button>
            <Button
              tone={tone === 'dark' ? 'dark' : 'light'}
              onTap={() => setBasicOpen(false)}
            >
              Confirm
            </Button>
          </PopupFooter>
        </PopupContent>
      </Popup>

      <Popup
        isOpen={backdropOpen}
        tone={tone}
        backdrop={backdropValue}
        onOpenChange={setBackdropOpen}
      >
        <PopupBackdrop />
        <PopupContent>
          <PopupHeader>Backdrop: {backdropValue}</PopupHeader>
          <PopupBody className="min-h-24">
            Switch between backdrop styles.
          </PopupBody>
          <PopupFooter>
            <Button
              tone={tone === 'dark' ? 'dark' : 'light'}
              variant="text"
              onTap={() => setBackdropOpen(false)}
            >
              Close
            </Button>
          </PopupFooter>
        </PopupContent>
      </Popup>

      <Popup
        isOpen={lockedOpen}
        tone={tone}
        isDismissable={false}
        onOpenChange={setLockedOpen}
      >
        <PopupBackdrop />
        <PopupContent>
          <PopupHeader>Locked Popup</PopupHeader>
          <PopupBody className="min-h-24">
            Backdrop clicks are disabled. Use the button to close.
          </PopupBody>
          <PopupFooter>
            <Button
              tone={tone === 'dark' ? 'dark' : 'light'}
              variant="text"
              onTap={() => setLockedOpen(false)}
            >
              Close
            </Button>
          </PopupFooter>
        </PopupContent>
      </Popup>

      <Popup
        isOpen={noBackdropOpen}
        tone={tone}
        hasBackdrop={false}
        onOpenChange={setNoBackdropOpen}
      >
        <PopupContent>
          <PopupHeader>No Backdrop</PopupHeader>
          <PopupBody className="min-h-24">Popup without a backdrop.</PopupBody>
          <PopupFooter>
            <Button
              tone={tone === 'dark' ? 'dark' : 'light'}
              variant="text"
              onTap={() => setNoBackdropOpen(false)}
            >
              Close
            </Button>
          </PopupFooter>
        </PopupContent>
      </Popup>
    </main>
  );
}
