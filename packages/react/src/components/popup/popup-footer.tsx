import type React from 'react';
import { forwardRef } from 'react';
import { usePopupContext } from './context';

export interface PopupFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const PopupFooter = forwardRef<HTMLDivElement, PopupFooterProps>(
  (props, ref) => {
    const { className, children, ...rest } = props;
    const { slots, classNames } = usePopupContext();

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

PopupFooter.displayName = 'Srcube.PopupFooter';

export default PopupFooter;
