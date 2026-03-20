import { Button } from '@srcube-ui/react';
import {
  type AddToastResult,
  addToast,
  clearToasts,
  closeToast,
  getToasts,
  showToast,
  subscribeToasts,
  Toaster,
  type ToasterClassNames,
  type ToastColor,
  type ToastTone,
  toast,
} from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/toaster')({
  component: ToasterDemo,
});

const tones: Array<{
  color: ToastColor;
  tone?: ToastTone;
  label: string;
  buttonColor:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  buttonTone?: 'light' | 'dark';
  buttonVariant?: 'solid' | 'outline';
}> = [
  {
    color: 'default',
    tone: 'default',
    label: 'Default',
    buttonColor: 'default',
    buttonTone: 'light',
    buttonVariant: 'outline',
  },
  {
    color: 'default',
    tone: 'dark',
    label: 'Dark',
    buttonColor: 'default',
    buttonTone: 'dark',
  },
  { color: 'primary', label: 'Primary', buttonColor: 'primary' },
  { color: 'secondary', label: 'Secondary', buttonColor: 'secondary' },
  { color: 'success', label: 'Success', buttonColor: 'success' },
  { color: 'warning', label: 'Warning', buttonColor: 'warning' },
  { color: 'danger', label: 'Danger', buttonColor: 'danger' },
];

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">{children}</section>
  );
}

function formatSnapshot() {
  const snapshot = getToasts();
  if (snapshot.length === 0) {
    return '-';
  }

  return snapshot
    .map((item) => `${item.id.slice(-6)}:${item.color}:${item.tone}:${item.state}`)
    .join(' | ');
}

function ToasterDemo() {
  const [useCustomClassNames, setUseCustomClassNames] = React.useState(false);
  const [useCustomStyle, setUseCustomStyle] = React.useState(false);
  const [toastCount, setToastCount] = React.useState(0);
  const [latestToastId, setLatestToastId] = React.useState('-');
  const [closedCount, setClosedCount] = React.useState(0);
  const [handleStatus, setHandleStatus] = React.useState('-');
  const [snapshotText, setSnapshotText] = React.useState('-');
  const [isSimulatingSave, setIsSimulatingSave] = React.useState(false);

  const manualHandleRef = React.useRef<AddToastResult | null>(null);

  React.useEffect(() => {
    return subscribeToasts((items) => {
      setToastCount(items.length);
      setLatestToastId(items.length > 0 ? items[items.length - 1].id : '-');
    });
  }, []);

  const demoClassNames = React.useMemo<Partial<ToasterClassNames>>(
    () => ({
      toast: 'ring-1 ring-primary/30 shadow-xl',
      title: 'tracking-wide',
      description: 'opacity-90',
      closeButton: 'bg-slate-200/70',
    }),
    [],
  );

  const showTone = React.useCallback(
    (color: ToastColor, tone: ToastTone | undefined, label: string) => {
    addToast({
      title: label,
      description: `${label} toast`,
      color,
      tone,
    });
    },
    [],
  );

  const showOnCloseToast = React.useCallback(() => {
    addToast({
      title: 'onClose callback',
      description: 'Close this toast to increase counter',
      showClose: true,
      shouldAutoDismiss: false,
      onClose: () => {
        setClosedCount((count) => count + 1);
      },
    });
  }, []);

  const showHandleToast = React.useCallback(() => {
    const handle = addToast({
      title: 'AddToastResult handle',
      description: 'Use close() or wait closed Promise',
      shouldAutoDismiss: false,
      showClose: true,
      color: 'secondary',
    });

    manualHandleRef.current = handle;
    setHandleStatus(`opened:${handle.id.slice(-6)}`);

    handle.closed.then(() => {
      if (manualHandleRef.current?.id === handle.id) {
        manualHandleRef.current = null;
      }
      setHandleStatus(`closed:${handle.id.slice(-6)}`);
    });
  }, []);

  const simulateSaveFlow = React.useCallback(async () => {
    if (isSimulatingSave) {
      return;
    }

    setIsSimulatingSave(true);
    const handle = addToast({
      title: 'Saving...',
      description: 'Please wait',
      shouldAutoDismiss: false,
      color: 'primary',
    });
    setHandleStatus(`saving:${handle.id.slice(-6)}`);

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1200);
    });

    handle.close();
    await handle.closed;
    toast.success({
      title: 'Saved',
      description: 'The operation has completed',
    });
    setHandleStatus(`flow done:${handle.id.slice(-6)}`);
    setIsSimulatingSave(false);
  }, [isSimulatingSave]);

  return (
    <main className="min-h-screen bg-slate-100 pb-safe-4 text-slate-900">
      <PageHeader title="Toaster" />

      <div className="space-y-6 p-4">
        <Card>
          <div className="text-sm font-semibold">Toaster Props</div>

          <div className="mt-3 text-xs text-slate-500">classNames / style</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              variant={useCustomClassNames ? 'solid' : 'outline'}
              onTap={() => setUseCustomClassNames((value) => !value)}
            >
              Custom classNames
            </Button>
            <Button
              variant={useCustomStyle ? 'solid' : 'outline'}
              onTap={() => setUseCustomStyle((value) => !value)}
            >
              Custom style
            </Button>
          </div>

          <div className="mt-3 text-xs text-slate-500">
            classNames={String(useCustomClassNames)}, style=
            {String(useCustomStyle)}
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">ToastOptions</div>

          <div className="mt-3 flex flex-wrap gap-2">
            {tones.map((item) => (
              <Button
                key={`${item.color}-${item.tone ?? 'default'}`}
                color={item.buttonColor}
                tone={item.buttonTone}
                variant={item.buttonVariant ?? 'solid'}
                onTap={() => showTone(item.color, item.tone, item.label)}
              >
                {item.label}
              </Button>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="outline"
              onTap={() => {
                addToast({
                  title: 'Custom Icon',
                  description: 'icon + secondary color',
                  icon: '★',
                  color: 'secondary',
                });
              }}
            >
              icon
            </Button>
            <Button
              variant="outline"
              onTap={() => {
                const id = `custom-${Date.now()}`;
                addToast({
                  id,
                  title: 'Custom ID',
                  description: id,
                  color: 'primary',
                  showClose: true,
                });
              }}
            >
              id
            </Button>
            <Button
              variant="outline"
              onTap={() => {
                addToast({
                  title: 'Short duration',
                  description: 'auto dismiss in 600ms',
                  duration: 600,
                });
              }}
            >
              duration
            </Button>
            <Button
              variant="outline"
              onTap={() => {
                addToast({
                  title: 'Persistent toast',
                  description: 'shouldAutoDismiss=false',
                  shouldAutoDismiss: false,
                  showClose: true,
                });
              }}
            >
              persistent
            </Button>
            <Button variant="outline" onTap={showOnCloseToast}>
              onClose
            </Button>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Registry API</div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="flat"
              onTap={() => {
                showToast({
                  title: 'showToast alias',
                  description: 'same as addToast',
                });
              }}
            >
              showToast
            </Button>
            <Button
              color="success"
              variant="flat"
              onTap={() => {
                toast.success({
                  title: 'toast.success',
                  description: 'helper API',
                });
              }}
            >
              toast.success
            </Button>
            <Button
              color="warning"
              variant="flat"
              onTap={() => {
                toast.warning({
                  title: 'toast.warning',
                  description: 'helper API',
                });
              }}
            >
              toast.warning
            </Button>
            <Button
              color="danger"
              variant="flat"
              onTap={() => {
                toast.danger({
                  title: 'toast.danger',
                  description: 'helper API',
                });
              }}
            >
              toast.danger
            </Button>
            <Button
              color="primary"
              variant="flat"
              onTap={() => {
                toast.primary({
                  title: 'toast.primary',
                  description: 'helper API',
                });
              }}
            >
              toast.primary
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" onTap={showHandleToast}>
              AddToastResult
            </Button>
            <Button
              variant="outline"
              onTap={() => {
                const handle = manualHandleRef.current;
                if (!handle) {
                  setHandleStatus('no handle');
                  return;
                }
                handle.close();
              }}
            >
              close(handle)
            </Button>
            <Button
              variant="outline"
              onTap={() => {
                if (latestToastId !== '-') {
                  closeToast(latestToastId);
                }
              }}
            >
              closeToast(id)
            </Button>
            <Button
              color="primary"
              variant={isSimulatingSave ? 'solid' : 'outline'}
              onTap={simulateSaveFlow}
            >
              {isSimulatingSave ? 'Saving...' : 'simulate save'}
            </Button>
            <Button
              variant="outline"
              onTap={() => {
                setSnapshotText(formatSnapshot());
              }}
            >
              getToasts()
            </Button>
            <Button
              variant="outline"
              onTap={() => {
                clearToasts();
                setSnapshotText('-');
                setHandleStatus('cleared');
              }}
            >
              clearToasts()
            </Button>
          </div>

          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            <div>active count: {toastCount}</div>
            <div>latest id: {latestToastId}</div>
            <div>onClose called: {closedCount}</div>
            <div>handle status: {handleStatus}</div>
            <div className="break-all">snapshot: {snapshotText}</div>
          </div>
        </Card>
      </div>

      <Toaster
        className={useCustomClassNames ? 'tracking-wide' : ''}
        classNames={useCustomClassNames ? demoClassNames : undefined}
        style={useCustomStyle ? { paddingInline: 12 } : undefined}
      />
    </main>
  );
}
