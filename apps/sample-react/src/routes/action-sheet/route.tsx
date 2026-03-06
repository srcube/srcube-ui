import { ActionSheet } from '@srcube-ui/react';
import { Button, ButtonGroup } from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/action-sheet')({
  component: ActionSheetDemo,
});

const actions = [
  {
    value: 'edit',
    label: 'Edit',
    description: 'Update current content',
  },
  {
    value: 'share',
    label: 'Share',
    description: 'Share with teammates',
  },
  {
    value: 'delete',
    label: 'Delete',
    description: 'This action cannot be undone',
    color: 'danger' as const,
  },
];

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl bg-white p-4 shadow-sm">{children}</section>;
}

function ActionSheetDemo() {
  const [open, setOpen] = React.useState(false);
  const [customOpen, setCustomOpen] = React.useState(false);
  const [footerOpen, setFooterOpen] = React.useState(false);
  const [cancelPropsOpen, setCancelPropsOpen] = React.useState(false);
  const [sizeSmOpen, setSizeSmOpen] = React.useState(false);
  const [sizeMdOpen, setSizeMdOpen] = React.useState(false);
  const [sizeLgOpen, setSizeLgOpen] = React.useState(false);
  const [result, setResult] = React.useState('-');

  return (
    <main className="min-h-screen bg-slate-100 pb-16 text-slate-900">
      <PageHeader title="Action Sheet" />

      <div className="space-y-6 p-4">
        <Card>
          <div className="text-sm font-semibold">Basic</div>
          <Button className="mt-3" isBlock onTap={() => setOpen(true)}>
            Open Action Sheet
          </Button>
          <div className="mt-2 text-xs text-slate-500">
            Backdrop press does not close the sheet
          </div>
          <div className="mt-1 text-xs text-slate-500">Result: {result}</div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Custom Header</div>
          <Button className="mt-3" variant="flat" isBlock onTap={() => setCustomOpen(true)}>
            Open Custom Header
          </Button>
          <div className="mt-2 text-xs text-slate-500">
            Customize header text with title/description.
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Custom Footer</div>
          <Button className="mt-3" variant="flat" isBlock onTap={() => setFooterOpen(true)}>
            Open Custom Footer
          </Button>
          <div className="mt-2 text-xs text-slate-500">
            Use <code>hasFooter</code> + <code>footer</code> to replace default cancel button.
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">cancelButtonProps</div>
          <Button
            className="mt-3"
            variant="flat"
            isBlock
            onTap={() => setCancelPropsOpen(true)}
          >
            Open Custom Cancel Button
          </Button>
          <div className="mt-2 text-xs text-slate-500">
            Customize cancel button color/variant/className with <code>cancelButtonProps</code>.
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Size</div>
          <div className="mt-3 flex gap-2">
            <Button className="flex-1" size="sm" variant="flat" onTap={() => setSizeSmOpen(true)}>
              Small
            </Button>
            <Button className="flex-1" size="md" variant="flat" onTap={() => setSizeMdOpen(true)}>
              Medium
            </Button>
            <Button className="flex-1" size="lg" variant="flat" onTap={() => setSizeLgOpen(true)}>
              Large
            </Button>
          </div>
        </Card>
      </div>

      <ActionSheet
        isOpen={open}
        title="More Actions"
        description="Choose an action"
        actions={actions}
        isInset
        onAction={(value) => {
          setResult(String(value));
        }}
        onOpenChange={setOpen}
      />

      <ActionSheet
        isOpen={customOpen}
        title="🔔 Notification Shortcuts"
        description="This is a custom header example"
        actions={actions}
        isInset
        onAction={(value) => {
          setResult(String(value));
        }}
        onOpenChange={setCustomOpen}
      />

      <ActionSheet
        isOpen={footerOpen}
        title="Export Report"
        description="Use custom footer with your own layout"
        actions={actions}
        hasFooter
        footer={(
          <ButtonGroup
            color="default"
            variant="flat"
            radius="lg"
            size="md"
            isBlock
            className="w-full"
          >
            <Button
              onTap={() => {
                setResult('later');
                setFooterOpen(false);
              }}
            >
              Later
            </Button>
            <Button
              color="danger"
              onTap={() => {
                setResult('dismiss');
                setFooterOpen(false);
              }}
            >
              Dismiss
            </Button>
          </ButtonGroup>
        )}
        isInset
        onAction={(value) => {
          setResult(String(value));
        }}
        onOpenChange={setFooterOpen}
      />

      <ActionSheet
        isOpen={cancelPropsOpen}
        title="Unsaved Changes"
        description="Cancel button is customized by cancelButtonProps"
        actions={actions}
        cancelText="Discard"
        cancelButtonProps={{
          color: 'danger',
          variant: 'flat',
          className: 'font-semibold',
        }}
        isInset
        onAction={(value) => {
          setResult(String(value));
        }}
        onOpenChange={setCancelPropsOpen}
      />

      <ActionSheet
        isOpen={sizeSmOpen}
        size="sm"
        title="Small Size"
        description="Action sheet with size=sm"
        actions={actions}
        isInset
        onAction={(value) => {
          setResult(String(value));
        }}
        onOpenChange={setSizeSmOpen}
      />

      <ActionSheet
        isOpen={sizeMdOpen}
        size="md"
        title="Medium Size"
        description="Action sheet with size=md (default)"
        actions={actions}
        isInset
        onAction={(value) => {
          setResult(String(value));
        }}
        onOpenChange={setSizeMdOpen}
      />

      <ActionSheet
        isOpen={sizeLgOpen}
        size="lg"
        title="Large Size"
        description="Action sheet with size=lg"
        actions={actions}
        isInset
        onAction={(value) => {
          setResult(String(value));
        }}
        onOpenChange={setSizeLgOpen}
      />
    </main>
  );
}
