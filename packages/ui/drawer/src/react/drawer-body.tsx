import { ModalBody, type ModalBodyProps } from '@srcube-ui/modal';

export interface DrawerBodyProps extends ModalBodyProps {}

function DrawerBody(props: DrawerBodyProps) {
  return <ModalBody {...props} />;
}

DrawerBody.displayName = 'Srcube.DrawerBody';

export default DrawerBody;
