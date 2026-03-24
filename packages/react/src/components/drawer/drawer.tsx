import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Popup, type PopupClassNames } from '../popup';
import { drawer as drawerStyles } from '@srcube-ui/styles/components/drawer';
import { DrawerProvider } from './context';
import DrawerContent from './drawer-content';
import type { DrawerReactProps, DrawerRef } from './props';

export interface DrawerProps extends DrawerReactProps {}

const Drawer = forwardRef<DrawerRef, DrawerProps>((props, ref) => {
  const {
    isOpen: isOpenProp,
    defaultOpen = false,
    placement = 'bottom',
    tone = 'default',
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
        tone,
        isOpen,
        placement,
        backdrop: backdrop ?? undefined,
      }),
    [tone, isOpen, placement, backdrop],
  );

  const mergedClassNames = useMemo<Partial<PopupClassNames>>(
    () => ({
      base: slots.base({
        class: [classNames?.base, className],
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
      <Popup
        ref={ref}
        {...rest}
        isOpen={isOpen}
        motion="none"
        backdrop={backdrop ?? undefined}
        tone={tone}
        onOpenChange={handleOpenChange}
        onClose={onClose}
        classNames={mergedClassNames}
      >
        {content}
      </Popup>
    </DrawerProvider>
  );
});

Drawer.displayName = 'Srcube.Drawer';

export default Drawer;
