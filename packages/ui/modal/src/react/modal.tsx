import { Children, forwardRef, isValidElement } from "react";
import { ModalOverlay } from "react-aria-components";
import { ModalProvider } from "./context";
import ModalBackdrop from "./modal-backdrop";
import type { ModalReactProps, ModalRef } from "./props";
import { useModal } from "./use";

export interface ModalProps extends ModalReactProps {}

const Modal = forwardRef<ModalRef, ModalProps>((props, ref) => {
  const modal = useModal({ ...props, ref });
  const {
    children,
    getRootPortalProps,
    isOpen,
    isDismissable,
    hasBackdrop,
    setOpen,
  } = modal;

  const hasCustomBackdrop = Children.toArray(children).some(
    (child) => isValidElement(child) && child.type === ModalBackdrop,
  );

  return (
    <ModalOverlay
      {...getRootPortalProps()}
      isOpen={isOpen}
      onOpenChange={setOpen}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={!isDismissable}
    >
      <ModalProvider value={modal}>
        {!hasCustomBackdrop && hasBackdrop ? <ModalBackdrop /> : null}
        {children}
      </ModalProvider>
    </ModalOverlay>
  );
});

Modal.displayName = "Srcube.Modal";

export default Modal;
