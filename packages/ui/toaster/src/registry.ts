import type {
  AddToastResult,
  ToastItem,
  ToastOptions,
} from './types';

const DEFAULT_DURATION = 1800;
const LEAVE_DURATION = 300;

let items: ToastItem[] = [];
let listeners: Array<(value: Omit<ToastItem, 'onClose'>[]) => void> = [];
const dismissTimers = new Map<string, ReturnType<typeof setTimeout>>();
const leaveTimers = new Map<string, ReturnType<typeof setTimeout>>();
const closedResolvers = new Map<string, () => void>();

function emit() {
  const snapshot = items.map(({ onClose, ...rest }) => ({ ...rest }));
  listeners.forEach((listener) => listener(snapshot));
}

function createId() {
  return `srcube-toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeOptions(options: ToastOptions): ToastItem {
  const duration =
    typeof options.duration === 'number' && Number.isFinite(options.duration)
      ? Math.max(0, Math.floor(options.duration))
      : DEFAULT_DURATION;

  return {
    id: options.id ?? createId(),
    title: options.title?.trim() ?? '',
    description: options.description?.trim() ?? '',
    tone: options.tone ?? 'dark',
    icon: options.icon ?? '',
    duration,
    shouldAutoDismiss: options.shouldAutoDismiss !== false,
    isClosable: options.isClosable === true,
    onClose: options.onClose ?? null,
    state: 'enter',
    createdAt: Date.now(),
  };
}

function clearTimerById(
  timerMap: Map<string, ReturnType<typeof setTimeout>>,
  id: string,
) {
  const timer = timerMap.get(id);
  if (!timer) {
    return;
  }

  clearTimeout(timer);
  timerMap.delete(id);
}

function scheduleDismiss(item: ToastItem) {
  clearTimerById(dismissTimers, item.id);
  if (!item.shouldAutoDismiss || item.duration <= 0) {
    return;
  }

  const timer = setTimeout(() => {
    closeToast(item.id);
  }, item.duration);
  dismissTimers.set(item.id, timer);
}

function scheduleLeaveRemoval(id: string) {
  clearTimerById(leaveTimers, id);
  const timer = setTimeout(() => {
    const target = items.find((item) => item.id === id);
    target?.onClose?.();
    items = items.filter((item) => item.id !== id);
    leaveTimers.delete(id);

    const resolve = closedResolvers.get(id);
    if (resolve) {
      resolve();
      closedResolvers.delete(id);
    }

    emit();
  }, LEAVE_DURATION);
  leaveTimers.set(id, timer);
}

export function subscribeToasts(listener: (value: Omit<ToastItem, 'onClose'>[]) => void) {
  listeners = [...listeners, listener];
  const snapshot = items.map(({ onClose, ...rest }) => ({ ...rest }));
  listener(snapshot);

  return () => {
    listeners = listeners.filter((candidate) => candidate !== listener);
  };
}

export function getToasts() {
  return items.map(({ onClose, ...rest }) => ({ ...rest }));
}

export function addToast(options: ToastOptions): AddToastResult {
  const item = normalizeOptions(options);

  let resolveClosed!: () => void;
  const closed = new Promise<void>((resolve) => {
    resolveClosed = resolve;
  });
  closedResolvers.set(item.id, resolveClosed);

  items = [...items, item];
  emit();
  scheduleDismiss(item);

  return {
    id: item.id,
    close: () => closeToast(item.id),
    closed,
  };
}

export const showToast = addToast;

export function closeToast(id: string) {
  const target = items.find((item) => item.id === id);
  if (!target || target.state === 'leave') {
    return;
  }

  clearTimerById(dismissTimers, id);

  items = items.map((item) =>
    item.id === id
      ? {
          ...item,
          state: 'leave',
        }
      : item,
  );
  emit();
  scheduleLeaveRemoval(id);
}

export function clearToasts() {
  items.forEach((item) => {
    clearTimerById(dismissTimers, item.id);
    clearTimerById(leaveTimers, item.id);
    item.onClose?.();

    const resolve = closedResolvers.get(item.id);
    if (resolve) {
      resolve();
      closedResolvers.delete(item.id);
    }
  });

  items = [];
  emit();
}

export const toast = Object.assign(addToast, {
  success: (options: Omit<ToastOptions, 'tone'>) =>
    addToast({ ...options, tone: 'success' }),
  warning: (options: Omit<ToastOptions, 'tone'>) =>
    addToast({ ...options, tone: 'warning' }),
  danger: (options: Omit<ToastOptions, 'tone'>) =>
    addToast({ ...options, tone: 'danger' }),
  primary: (options: Omit<ToastOptions, 'tone'>) =>
    addToast({ ...options, tone: 'primary' }),
});
