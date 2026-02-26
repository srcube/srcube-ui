import { PopupBody, type PopupBodyProps } from '@srcube-ui/popup';

export interface DrawerBodyProps extends PopupBodyProps {}

function DrawerBody(props: DrawerBodyProps) {
  return <PopupBody {...props} />;
}

DrawerBody.displayName = 'Srcube.DrawerBody';

export default DrawerBody;
