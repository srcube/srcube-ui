import type React from 'react';
import { forwardRef } from 'react';
import { useModalContext } from './context';

export interface ModalFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  (props, ref) => {
    const { className, children, ...rest } = props;
    const { slots, classNames } = useModalContext();

    return (
      <div
        ref={ref}
        className={slots.footer({ class: [classNames?.footer, className] })}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

ModalFooter.displayName = 'Srcube.ModalFooter';

export default ModalFooter;
