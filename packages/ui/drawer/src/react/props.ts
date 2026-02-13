import type * as React from 'react';
import type { ModalRef, ModalReactProps } from '@srcube-ui/modal';
import type { DrawerPlacement, DrawerReactClassNames } from '../style';

export type DrawerRef = ModalRef;

export type DrawerReactProps = Omit<ModalReactProps, 'classNames'> & {
  placement?: DrawerPlacement;
  title?: React.ReactNode;
  classNames?: Partial<DrawerReactClassNames>;
};
