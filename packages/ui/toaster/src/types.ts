export type ToastTone =
  | 'light'
  | 'dark'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger';

export type ToastState = 'enter' | 'leave';

export type ToastOptions = {
  id?: string;
  title?: string;
  description?: string;
  tone?: ToastTone;
  icon?: string;
  duration?: number;
  shouldAutoDismiss?: boolean;
  isClosable?: boolean;
  onClose?: () => void;
};

export type ToastItem = {
  id: string;
  title: string;
  description: string;
  tone: ToastTone;
  icon: string;
  duration: number;
  shouldAutoDismiss: boolean;
  isClosable: boolean;
  onClose: (() => void) | null;
  state: ToastState;
  createdAt: number;
};

export type AddToastResult = {
  id: string;
  close: () => void;
  closed: Promise<void>;
};
