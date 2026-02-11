import { forwardRef } from 'react';
import {
  Dialog,
  type DialogProps,
  Modal as RacModal,
} from 'react-aria-components';
import { useModalContext } from './context';

export interface ModalContentProps extends Omit<DialogProps, 'className'> {
  className?: string;
}

const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  (props, ref) => {
    const { className, children, ...rest } = props;
    const { slots, classNames } = useModalContext();

    return (
      <RacModal>
        <Dialog
          ref={ref}
          className={slots.content({ class: [classNames?.content, className] })}
          {...rest}
        >
          {children}
        </Dialog>
      </RacModal>
    );
  },
);

ModalContent.displayName = 'Srcube.ModalContent';

export default ModalContent;
