import { ModalHeader, type ModalHeaderProps } from '@srcube-ui/modal';

export interface DrawerHeaderProps extends ModalHeaderProps {}

function DrawerHeader(props: DrawerHeaderProps) {
  return <ModalHeader {...props} />;
}

DrawerHeader.displayName = 'Srcube.DrawerHeader';

export default DrawerHeader;
