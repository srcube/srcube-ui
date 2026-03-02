import { Button } from '@srcube-ui/button';
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
  type ToastTone,
  toast,
} from '@srcube-ui/toaster';
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/toaster')({
  component: ToasterDemo,
});

const tones: Array<{
  tone: ToastTone;
  label: string;
  buttonColor:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
}> = [
  { tone: 'light', label: 'Light', buttonColor: 'default' },
  { tone: 'dark', label: 'Dark', buttonColor: 'default' },
  { tone: 'primary', label: 'Primary', buttonColor: 'primary' },
  { tone: 'secondary', label: 'Secondary', buttonColor: 'secondary' },
  { tone: 'success', label: 'Success', buttonColor: 'success' },
  { tone: 'warning', label: 'Warning', buttonColor: 'warning' },
  { tone: 'danger', label: 'Danger', buttonColor: 'danger' },
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
    .map((item) => `${item.id.slice(-6)}:${item.tone}:${item.state}`)
    .join(' | ');
}

function ToasterDemo() {
  const [max, setMax] = React.useState(1);
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

  const showTone = React.useCallback((tone: ToastTone, label: string) => {
    addToast({
      title: label,
      description: `${label} tone toast`,
      tone,
    });
  }, []);

  const showOnCloseToast = React.useCallback(() => {
    addToast({
      title: 'onClose callback',
      description: 'Close this toast to increase counter',
      isClosable: true,
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
      isClosable: true,
      tone: 'secondary',
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
      tone: 'primary',
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

          <div className="mt-3 text-xs text-slate-500">max</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              variant={max === 1 ? 'solid' : 'outline'}
              onTap={() => setMax(1)}
            >
              Max 1
            </Button>
            <Button
              variant={max === 2 ? 'solid' : 'outline'}
              onTap={() => setMax(2)}
            >
              Max 2
            </Button>
            <Button
              variant={max === 3 ? 'solid' : 'outline'}
              onTap={() => setMax(3)}
            >
              Max 3
            </Button>
          </div>

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
            max={max}, classNames={String(useCustomClassNames)}, style=
            {String(useCustomStyle)}
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">ToastOptions</div>

          <div className="mt-3 flex flex-wrap gap-2">
            {tones.map((item) => (
              <Button
                key={item.tone}
                color={item.buttonColor}
                variant={item.buttonColor === 'default' ? 'outline' : 'solid'}
                onTap={() => showTone(item.tone, item.label)}
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
                  description: 'icon + secondary tone',
                  icon: '★',
                  tone: 'secondary',
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
                  tone: 'primary',
                  isClosable: true,
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
                  isClosable: true,
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
        max={max}
        className={useCustomClassNames ? 'tracking-wide' : ''}
        classNames={useCustomClassNames ? demoClassNames : undefined}
        style={useCustomStyle ? { paddingInline: 12 } : undefined}
      />
    </main>
  );
}
