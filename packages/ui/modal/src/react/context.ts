import * as React from "react";
import type { ModalClasses, modal } from "../style";

type ModalContextValue = {
  slots: ReturnType<typeof modal>;
  classNames?: Partial<ModalClasses>;
  isOpen: boolean;
  isDismissable: boolean;
  hasBackdrop: boolean;
  open: () => void;
  close: () => void;
};

const ModalContext = React.createContext<ModalContextValue | null>(null);

export const ModalProvider = ModalContext.Provider;

export function useModalContext() {
  const ctx = React.useContext(ModalContext);
  if (!ctx) {
    throw new Error("Modal components must be wrapped in <Modal>.");
  }
  return ctx;
}
