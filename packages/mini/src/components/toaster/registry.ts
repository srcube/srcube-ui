import type {
  AddToastResult,
  ToastItem,
  ToastLifecycleState,
  ToastOptions,
  ToastTone,
} from './types';

const DEFAULT_DURATION = 1800;
const LEAVE_DURATION = 300;

let items: ToastItem[] = [];
let listeners: Array<(value: Omit<ToastItem, 'onClose'>[]) => void> = [];
const dismissTimers = new Map<string, ReturnType<typeof setTimeout>>();
const leaveTimers = new Map<string, ReturnType<typeof setTimeout>>();
const closedResolvers = new Map<string, () => void>();
let activeToastId: string | null = null;

function emit() {
  const snapshot = items.map(({ onClose, ...rest }) => ({ ...rest }));
  listeners.forEach((listener) => {
    listener(snapshot);
  });
}

function createId() {
  return `srcube-toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeTone(tone: string | undefined): ToastTone {
  if (tone === 'primary') {
    return 'info';
  }

  if (tone === 'danger') {
    return 'error';
  }

  return tone ?? 'dark';
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
    tone: normalizeTone(options.tone as string | undefined),
    icon: options.icon ?? '',
    duration,
    shouldAutoDismiss: options.shouldAutoDismiss !== false,
    showClose: options.showClose === true,
    onClose: options.onClose ?? null,
    state: 'enter',
    lifecycle: 'queued',
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

function clearAllDismissTimers() {
  dismissTimers.forEach((timer) => {
    clearTimeout(timer);
  });
  dismissTimers.clear();
}

function scheduleDismiss(id: string) {
  clearAllDismissTimers();
  const item = items.find((candidate) => candidate.id === id);

  if (
    !item ||
    item.lifecycle !== 'active' ||
    item.state === 'leave' ||
    !item.shouldAutoDismiss ||
    item.duration <= 0
  ) {
    return;
  }

  const timer = setTimeout(() => {
    const latest = items.find((candidate) => candidate.id === id);
    if (!latest || latest.lifecycle !== 'active' || latest.state === 'leave') {
      return;
    }

    closeToast(id);
  }, item.duration);

  dismissTimers.set(id, timer);
}

function updateLifecycle(id: string, lifecycle: ToastLifecycleState) {
  items = items.map((item) =>
    item.id === id
      ? {
          ...item,
          lifecycle,
        }
      : item,
  );
}

function pauseAndResetExistingToasts() {
  clearAllDismissTimers();
  activeToastId = null;

  items = items.map((item) => {
    if (
      item.state === 'leave' ||
      item.lifecycle === 'closing' ||
      item.lifecycle === 'closed'
    ) {
      return item;
    }

    return {
      ...item,
      lifecycle: 'paused',
    };
  });
}

function activateToast(id: string) {
  const target = items.find((item) => item.id === id);
  if (!target || target.state === 'leave') {
    return;
  }

  activeToastId = id;
  updateLifecycle(id, 'active');
  emit();
  scheduleDismiss(id);
}

function promoteNextToast() {
  if (activeToastId) {
    const active = items.find((item) => item.id === activeToastId);
    if (active && active.lifecycle === 'active' && active.state !== 'leave') {
      return;
    }

    activeToastId = null;
  }

  for (let index = items.length - 1; index >= 0; index -= 1) {
    const candidate = items[index];
    if (candidate.state === 'leave') {
      continue;
    }
    if (candidate.lifecycle !== 'paused' && candidate.lifecycle !== 'queued') {
      continue;
    }

    activateToast(candidate.id);
    return;
  }
}

function scheduleLeaveRemoval(
  id: string,
  opts?: {
    wasActive?: boolean;
  },
) {
  clearTimerById(leaveTimers, id);

  const timer = setTimeout(() => {
    const target = items.find((item) => item.id === id);
    target?.onClose?.();
    if (target) {
      updateLifecycle(id, 'closed');
    }

    items = items.filter((item) => item.id !== id);
    leaveTimers.delete(id);

    const resolve = closedResolvers.get(id);
    if (resolve) {
      resolve();
      closedResolvers.delete(id);
    }

    emit();
    if (opts?.wasActive) {
      promoteNextToast();
    }
  }, LEAVE_DURATION);

  leaveTimers.set(id, timer);
}

export function subscribeToasts(
  listener: (value: Omit<ToastItem, 'onClose'>[]) => void,
) {
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
  const item: ToastItem = {
    ...normalizeOptions(options),
    lifecycle: 'active',
  };

  let resolveClosed!: () => void;
  const closed = new Promise<void>((resolve) => {
    resolveClosed = resolve;
  });
  closedResolvers.set(item.id, resolveClosed);

  pauseAndResetExistingToasts();

  items = [...items, item];
  activeToastId = item.id;
  emit();
  scheduleDismiss(item.id);

  return {
    id: item.id,
    close: () => closeToast(item.id),
    closed,
  };
}

export const showToast = addToast;

export function closeToast(id: string) {
  const target = items.find((item) => item.id === id);
  if (
    !target ||
    target.state === 'leave' ||
    target.lifecycle === 'closing' ||
    target.lifecycle === 'closed'
  ) {
    return;
  }

  clearTimerById(dismissTimers, id);

  const wasActive = activeToastId === id;
  if (wasActive) {
    activeToastId = null;
  }

  items = items.map((item) =>
    item.id === id
      ? {
          ...item,
          state: 'leave',
          lifecycle: 'closing',
        }
      : item,
  );

  emit();
  scheduleLeaveRemoval(id, { wasActive });
}

export function clearToasts() {
  activeToastId = null;
  clearAllDismissTimers();

  items.forEach((item) => {
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
  error: (options: Omit<ToastOptions, 'tone'>) =>
    addToast({ ...options, tone: 'error' }),
  info: (options: Omit<ToastOptions, 'tone'>) =>
    addToast({ ...options, tone: 'info' }),
});
