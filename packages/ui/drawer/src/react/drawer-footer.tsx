import { PopupFooter, type PopupFooterProps } from '@srcube-ui/popup';

export interface DrawerFooterProps extends PopupFooterProps {}

function DrawerFooter(props: DrawerFooterProps) {
  return <PopupFooter {...props} />;
}

DrawerFooter.displayName = 'Srcube.DrawerFooter';

export default DrawerFooter;
