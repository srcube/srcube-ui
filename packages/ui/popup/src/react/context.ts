import * as React from 'react';
import { type PopupClasses, popup } from '../style';

type PopupContextValue = {
  slots: ReturnType<typeof popup>;
  classNames?: Partial<PopupClasses>;
  isOpen: boolean;
  isDismissable: boolean;
  hasBackdrop: boolean;
  open: () => void;
  close: () => void;
};

const PopupContext = React.createContext<PopupContextValue | null>(null);

export const PopupProvider = PopupContext.Provider;

export function usePopupContext() {
  const ctx = React.useContext(PopupContext);
  if (!ctx) {
    throw new Error('Popup components must be wrapped in <Popup>.');
  }
  return ctx;
}
