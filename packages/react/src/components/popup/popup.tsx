import { Children, forwardRef, isValidElement } from 'react';
import { ModalOverlay } from 'react-aria-components';
import { PopupProvider } from './context';
import PopupBackdrop from './popup-backdrop';
import type { PopupReactProps, PopupRef } from './props';
import { usePopup } from './use';

export interface PopupProps extends PopupReactProps {}

const Popup = forwardRef<PopupRef, PopupProps>((props, ref) => {
  const popup = usePopup({ ...props, ref });
  const {
    children,
    getRootPortalProps,
    isVisible,
    isDismissable,
    hasBackdrop,
    setOpen,
  } = popup;

  const hasCustomBackdrop = Children.toArray(children).some(
    (child) => isValidElement(child) && child.type === PopupBackdrop,
  );

  return (
    <ModalOverlay
      {...getRootPortalProps()}
      isOpen={isVisible}
      onOpenChange={setOpen}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={!isDismissable}
    >
      <PopupProvider value={popup}>
        {!hasCustomBackdrop && hasBackdrop ? <PopupBackdrop /> : null}
        {children}
      </PopupProvider>
    </ModalOverlay>
  );
});

Popup.displayName = 'Srcube.Popup';

export default Popup;
