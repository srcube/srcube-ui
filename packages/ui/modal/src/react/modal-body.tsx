import type React from 'react';
import { forwardRef } from 'react';
import { useModalContext } from './context';

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>((props, ref) => {
  const { className, children, ...rest } = props;
  const { slots, classNames } = useModalContext();

  return (
    <div
      ref={ref}
      className={slots.body({ class: [classNames?.body, className] })}
      {...rest}
    >
      {children}
    </div>
  );
});

ModalBody.displayName = 'Srcube.ModalBody';

export default ModalBody;
