import type React from 'react';
import { forwardRef } from 'react';
import { useModalContext } from './context';

export interface ModalHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  (props, ref) => {
    const { className, children, ...rest } = props;
    const { slots, classNames } = useModalContext();

    return (
      <div
        ref={ref}
        className={slots.header({ class: [classNames?.header, className] })}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

ModalHeader.displayName = 'Srcube.ModalHeader';

export default ModalHeader;
