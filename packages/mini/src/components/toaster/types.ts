export type ToastColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger';

export type ToastTone = 'default' | 'dark';

export type ToastState = 'enter' | 'leave';
export type ToastLifecycleState =
  | 'queued'
  | 'active'
  | 'paused'
  | 'closing'
  | 'closed';

export type ToastOptions = {
  id?: string;
  title?: string;
  description?: string;
  color?: ToastColor;
  tone?: ToastTone;
  icon?: string;
  duration?: number;
  shouldAutoDismiss?: boolean;
  showClose?: boolean;
  onClose?: () => void;
};

export type ToastItem = {
  id: string;
  title: string;
  description: string;
  color: ToastColor;
  tone: ToastTone;
  icon: string;
  duration: number;
  shouldAutoDismiss: boolean;
  showClose: boolean;
  onClose: (() => void) | null;
  state: ToastState;
  lifecycle: ToastLifecycleState;
  createdAt: number;
};

export type AddToastResult = {
  id: string;
  close: () => void;
  closed: Promise<void>;
};
