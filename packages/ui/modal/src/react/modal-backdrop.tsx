import type React from "react";
import { forwardRef, useCallback } from "react";
import { useModalContext } from "./context";

export interface ModalBackdropProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const ModalBackdrop = forwardRef<HTMLDivElement, ModalBackdropProps>(
  (props, ref) => {
    const { className, onClick, ...rest } = props;
    const { slots, classNames, isDismissable, hasBackdrop, close } =
      useModalContext();

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

ModalBackdrop.displayName = "Srcube.ModalBackdrop";

export default ModalBackdrop;
