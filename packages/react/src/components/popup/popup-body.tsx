import type React from 'react';
import { forwardRef } from 'react';
import { usePopupContext } from './context';

export interface PopupBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const PopupBody = forwardRef<HTMLDivElement, PopupBodyProps>((props, ref) => {
  const { className, children, ...rest } = props;
  const { slots, classNames } = usePopupContext();

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

PopupBody.displayName = 'Srcube.PopupBody';

export default PopupBody;
