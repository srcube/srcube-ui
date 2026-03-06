import { Button } from '@srcube-ui/react';
import {
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
      <div className="mt-3 flex flex-wrap gap-3">{children}</div>
    </section>
  );
}

function PopupDemo() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [backdropValue, setBackdropValue] = useState<BackdropType>('opaque');
  const [lockedOpen, setLockedOpen] = useState(false);
  const [noBackdropOpen, setNoBackdropOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Popup" />
      <div className="px-4 pb-8">
        <Section title="Basic" description="default popup">
          <Button onTap={() => setBasicOpen(true)}>Open Popup</Button>
        </Section>

        <Section title="Backdrop" description="opaque / blur / transparent">
          <Button
            variant="outline"
            onTap={() => {
              setBackdropValue('opaque');
              setBackdropOpen(true);
            }}
          >
            Opaque
          </Button>
          <Button
            variant="outline"
            onTap={() => {
              setBackdropValue('blur');
              setBackdropOpen(true);
            }}
          >
            Blur
          </Button>
          <Button
            variant="outline"
            onTap={() => {
              setBackdropValue('transparent');
              setBackdropOpen(true);
            }}
          >
            Transparent
          </Button>
        </Section>

        <Section title="Non Dismissable">
          <Button onTap={() => setLockedOpen(true)}>Open Locked</Button>
        </Section>

        <Section title="No Backdrop">
          <Button onTap={() => setNoBackdropOpen(true)}>Open Popup</Button>
        </Section>
      </div>

      <Popup isOpen={basicOpen} onOpenChange={setBasicOpen}>
        <PopupBackdrop />
        <PopupContent>
          <PopupHeader>Basic Popup</PopupHeader>
          <PopupBody>This is a basic popup message.</PopupBody>
          <PopupFooter>
            <Button variant="text" onTap={() => setBasicOpen(false)}>
              Cancel
            </Button>
            <Button onTap={() => setBasicOpen(false)}>Confirm</Button>
          </PopupFooter>
        </PopupContent>
      </Popup>

      <Popup
        isOpen={backdropOpen}
        backdrop={backdropValue}
        onOpenChange={setBackdropOpen}
      >
        <PopupBackdrop />
        <PopupContent>
          <PopupHeader>Backdrop: {backdropValue}</PopupHeader>
          <PopupBody>Switch between backdrop styles.</PopupBody>
          <PopupFooter>
            <Button variant="text" onTap={() => setBackdropOpen(false)}>
              Close
            </Button>
          </PopupFooter>
        </PopupContent>
      </Popup>

      <Popup
        isOpen={lockedOpen}
        isDismissable={false}
        onOpenChange={setLockedOpen}
      >
        <PopupBackdrop />
        <PopupContent>
          <PopupHeader>Locked Popup</PopupHeader>
          <PopupBody>Backdrop clicks are disabled. Use the button to close.</PopupBody>
          <PopupFooter>
            <Button variant="text" onTap={() => setLockedOpen(false)}>
              Close
            </Button>
          </PopupFooter>
        </PopupContent>
      </Popup>

      <Popup
        isOpen={noBackdropOpen}
        hasBackdrop={false}
        onOpenChange={setNoBackdropOpen}
      >
        <PopupContent>
          <PopupHeader>No Backdrop</PopupHeader>
          <PopupBody>Popup without a backdrop.</PopupBody>
          <PopupFooter>
            <Button variant="text" onTap={() => setNoBackdropOpen(false)}>
              Close
            </Button>
          </PopupFooter>
        </PopupContent>
      </Popup>
    </main>
  );
}
