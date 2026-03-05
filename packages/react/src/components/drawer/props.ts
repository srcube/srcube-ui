import type * as React from 'react';
import type { PopupRef, PopupReactProps } from '../popup';
import type { DrawerPlacement, DrawerReactClassNames } from '@srcube-ui/styles/components/drawer';

export type DrawerRef = PopupRef;

export type DrawerReactProps = Omit<PopupReactProps, 'classNames'> & {
  placement?: DrawerPlacement;
  title?: React.ReactNode;
  classNames?: Partial<DrawerReactClassNames>;
};
