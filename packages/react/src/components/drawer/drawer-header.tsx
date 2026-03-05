import { PopupHeader, type PopupHeaderProps } from '../popup';

export interface DrawerHeaderProps extends PopupHeaderProps {}

function DrawerHeader(props: DrawerHeaderProps) {
  return <PopupHeader {...props} />;
}

DrawerHeader.displayName = 'Srcube.DrawerHeader';

export default DrawerHeader;
