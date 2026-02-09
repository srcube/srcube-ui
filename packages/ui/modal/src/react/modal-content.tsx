import type React from "react";
import { forwardRef } from "react";
import { Dialog, Modal as RacModal } from "react-aria-components";
import { useModalContext } from "./context";

export interface ModalContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

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

ModalContent.displayName = "Srcube.ModalContent";

export default ModalContent;
