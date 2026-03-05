import type React from "react";
import { forwardRef, useCallback } from "react";
import { usePopupContext } from "./context";

export interface PopupBackdropProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const PopupBackdrop = forwardRef<HTMLDivElement, PopupBackdropProps>(
  (props, ref) => {
    const { className, onClick, ...rest } = props;
    const { slots, classNames, isDismissable, hasBackdrop, close } =
      usePopupContext();

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (!isDismissable) return;
        onClick?.(event);
        close();
      },
      [isDismissable, onClick, close],
    );

    if (!hasBackdrop) return null;

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={slots.backdrop({ class: [classNames?.backdrop, className] })}
        onClick={handleClick}
        {...rest}
      />
    );
  },
);

PopupBackdrop.displayName = "Srcube.PopupBackdrop";

export default PopupBackdrop;
