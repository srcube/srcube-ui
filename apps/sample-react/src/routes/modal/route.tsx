import { Button } from '@srcube-ui/button';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@srcube-ui/modal';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/modal')({
  component: ModalDemo,
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

function ModalDemo() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [backdropValue, setBackdropValue] = useState<BackdropType>('opaque');
  const [lockedOpen, setLockedOpen] = useState(false);
  const [noBackdropOpen, setNoBackdropOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Modal" />
      <div className="px-4 pb-8">
        <Section title="Basic" description="default modal">
          <Button onTap={() => setBasicOpen(true)}>Open Modal</Button>
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
          <Button onTap={() => setNoBackdropOpen(true)}>Open Modal</Button>
        </Section>
      </div>

      <Modal isOpen={basicOpen} onOpenChange={setBasicOpen}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>Basic Modal</ModalHeader>
          <ModalBody>This is a basic modal message.</ModalBody>
          <ModalFooter>
            <Button variant="text" onTap={() => setBasicOpen(false)}>
              Cancel
            </Button>
            <Button onTap={() => setBasicOpen(false)}>Confirm</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={backdropOpen}
        backdrop={backdropValue}
        onOpenChange={setBackdropOpen}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>Backdrop: {backdropValue}</ModalHeader>
          <ModalBody>Switch between backdrop styles.</ModalBody>
          <ModalFooter>
            <Button variant="text" onTap={() => setBackdropOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={lockedOpen}
        isDismissable={false}
        onOpenChange={setLockedOpen}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>Locked Modal</ModalHeader>
          <ModalBody>Backdrop clicks are disabled. Use the button to close.</ModalBody>
          <ModalFooter>
            <Button variant="text" onTap={() => setLockedOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={noBackdropOpen}
        hasBackdrop={false}
        onOpenChange={setNoBackdropOpen}
      >
        <ModalContent>
          <ModalHeader>No Backdrop</ModalHeader>
          <ModalBody>Modal without a backdrop.</ModalBody>
          <ModalFooter>
            <Button variant="text" onTap={() => setNoBackdropOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </main>
  );
}
