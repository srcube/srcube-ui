import { PopupFooter, type PopupFooterProps } from '../popup';

export interface DrawerFooterProps extends PopupFooterProps {}

function DrawerFooter(props: DrawerFooterProps) {
  return <PopupFooter {...props} />;
}

DrawerFooter.displayName = 'Srcube.DrawerFooter';

export default DrawerFooter;
