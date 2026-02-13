import { ModalFooter, type ModalFooterProps } from '@srcube-ui/modal';

export interface DrawerFooterProps extends ModalFooterProps {}

function DrawerFooter(props: DrawerFooterProps) {
  return <ModalFooter {...props} />;
}

DrawerFooter.displayName = 'Srcube.DrawerFooter';

export default DrawerFooter;
