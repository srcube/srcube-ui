import { Children, forwardRef, isValidElement } from 'react';
import {
  PopupBody,
  PopupContent,
  PopupHeader,
  type PopupContentProps,
} from '@srcube-ui/popup';
import { useDrawerContext } from './context';
import DrawerBody from './drawer-body';
import DrawerFooter from './drawer-footer';
import DrawerHeader from './drawer-header';

export interface DrawerContentProps extends PopupContentProps {}

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
      <PopupContent ref={ref} {...rest}>
        {customHeader || (title ? <PopupHeader>{title}</PopupHeader> : null)}
        {customBody || (content.length > 0 ? <PopupBody>{content}</PopupBody> : null)}
        {customFooter || null}
      </PopupContent>
    );
  },
);

DrawerContent.displayName = 'Srcube.DrawerContent';

export default DrawerContent;
