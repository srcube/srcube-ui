import { forwardRef } from 'react';
import {
  Dialog,
  type DialogProps,
  Modal as RacModal,
} from 'react-aria-components';
import { usePopupContext } from './context';

export interface PopupContentProps extends Omit<DialogProps, 'className'> {
  className?: string;
}

const PopupContent = forwardRef<HTMLDivElement, PopupContentProps>(
  (props, ref) => {
    const { className, children, ...rest } = props;
    const { slots, classNames } = usePopupContext();

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

PopupContent.displayName = 'Srcube.PopupContent';

export default PopupContent;
