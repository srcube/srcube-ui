import type React from 'react';
import { forwardRef } from 'react';
import { usePopupContext } from './context';

export interface PopupHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const PopupHeader = forwardRef<HTMLDivElement, PopupHeaderProps>(
  (props, ref) => {
    const { className, children, ...rest } = props;
    const { slots, classNames } = usePopupContext();

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

PopupHeader.displayName = 'Srcube.PopupHeader';

export default PopupHeader;
