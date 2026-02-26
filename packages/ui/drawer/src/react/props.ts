import type * as React from 'react';
import type { PopupRef, PopupReactProps } from '@srcube-ui/popup';
import type { DrawerPlacement, DrawerReactClassNames } from '../style';

export type DrawerRef = PopupRef;

export type DrawerReactProps = Omit<PopupReactProps, 'classNames'> & {
  placement?: DrawerPlacement;
  title?: React.ReactNode;
  classNames?: Partial<DrawerReactClassNames>;
};
