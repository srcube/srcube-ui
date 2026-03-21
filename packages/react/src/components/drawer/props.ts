import type * as React from 'react';
import type { PopupRef, PopupReactProps } from '../popup';
import type {
  DrawerPlacement,
  DrawerReactClassNames,
  DrawerVariants,
} from '@srcube-ui/styles/components/drawer';

export type DrawerRef = PopupRef;

export type DrawerReactProps = Omit<PopupReactProps, 'classNames'> & {
  placement?: DrawerPlacement;
  tone?: DrawerVariants['tone'];
  title?: React.ReactNode;
  classNames?: Partial<DrawerReactClassNames>;
};
