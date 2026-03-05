import { PopupBody, type PopupBodyProps } from '../popup';

export interface DrawerBodyProps extends PopupBodyProps {}

function DrawerBody(props: DrawerBodyProps) {
  return <PopupBody {...props} />;
}

DrawerBody.displayName = 'Srcube.DrawerBody';

export default DrawerBody;
