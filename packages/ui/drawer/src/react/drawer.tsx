import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Modal, type ModalClassNames } from '@srcube-ui/modal';
import { drawer as drawerStyles } from '../style';
import { DrawerProvider } from './context';
import DrawerContent from './drawer-content';
import type { DrawerReactProps, DrawerRef } from './props';

export interface DrawerProps extends DrawerReactProps {}

const Drawer = forwardRef<DrawerRef, DrawerProps>((props, ref) => {
  const {
    isOpen: isOpenProp,
    defaultOpen = false,
    placement = 'bottom',
    title,
    children,
    className,
    classNames,
    backdrop,
    onOpenChange,
    onClose,
    ...rest
  } = props;

  const isControlled = isOpenProp !== null && isOpenProp !== undefined;
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const isOpen = isControlled ? Boolean(isOpenProp) : innerOpen;

  const slots = useMemo(
    () =>
      drawerStyles({
        isOpen,
        placement,
        backdrop: backdrop ?? undefined,
      }),
    [isOpen, placement, backdrop],
  );

  const mergedClassNames = useMemo<Partial<ModalClassNames>>(
    () => ({
      rootPortal: slots.rootPortal({
        class: [classNames?.rootPortal, className],
      }),
      backdrop: slots.backdrop({ class: classNames?.backdrop }),
      content: slots.content({ class: classNames?.content }),
      header: slots.header({ class: classNames?.header }),
      body: slots.body({ class: classNames?.body }),
      footer: slots.footer({ class: classNames?.footer }),
    }),
    [slots, classNames, className],
  );

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInnerOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const hasDrawerContent = Children.toArray(children).some(
    (child) => isValidElement(child) && child.type === DrawerContent,
  );

  const content = hasDrawerContent ? (
    children
  ) : (
    <DrawerContent>{children}</DrawerContent>
  );

  return (
    <DrawerProvider value={{ title }}>
      <Modal
        ref={ref}
        {...rest}
        isOpen={isOpen}
        motion="none"
        backdrop={backdrop}
        onOpenChange={handleOpenChange}
        onClose={onClose}
        classNames={mergedClassNames}
      >
        {content}
      </Modal>
    </DrawerProvider>
  );
});

Drawer.displayName = 'Srcube.Drawer';

export default Drawer;
