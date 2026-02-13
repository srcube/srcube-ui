import { Children, forwardRef, isValidElement } from 'react';
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalContentProps,
} from '@srcube-ui/modal';
import { useDrawerContext } from './context';
import DrawerBody from './drawer-body';
import DrawerFooter from './drawer-footer';
import DrawerHeader from './drawer-header';

export interface DrawerContentProps extends ModalContentProps {}

const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  (props, ref) => {
    const { children, ...rest } = props;
    const { title } = useDrawerContext();

    const childrenList = Children.toArray(children);

    const content = childrenList.filter(
      (child) =>
        !(
          isValidElement(child) &&
          [DrawerHeader, DrawerBody, DrawerFooter].includes(child.type as never)
        ),
    );

    const customHeader = childrenList.find(
      (child) => isValidElement(child) && child.type === DrawerHeader,
    );

    const customBody = childrenList.find(
      (child) => isValidElement(child) && child.type === DrawerBody,
    );

    const customFooter = childrenList.find(
      (child) => isValidElement(child) && child.type === DrawerFooter,
    );

    return (
      <ModalContent ref={ref} {...rest}>
        {customHeader || (title ? <ModalHeader>{title}</ModalHeader> : null)}
        {customBody || (content.length > 0 ? <ModalBody>{content}</ModalBody> : null)}
        {customFooter || null}
      </ModalContent>
    );
  },
);

DrawerContent.displayName = 'Srcube.DrawerContent';

export default DrawerContent;
