import type * as React from 'react';
import type { ActionSheetClassNames, ActionSheetVariants } from '../style';

export type ActionSheetValue = string | number;

export type ActionSheetItem = {
  value: ActionSheetValue;
  label: React.ReactNode;
  description?: React.ReactNode;
  color?: 'default' | 'danger';
  isDisabled?: boolean;
};

type ActionSheetNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | 'onChange' | keyof ActionSheetVariants
>;

export type ActionSheetReactProps = ActionSheetVariants &
  ActionSheetNativeProps & {
    isOpen?: boolean;
    defaultOpen?: boolean;
    title?: React.ReactNode;
    description?: React.ReactNode;
    actions: ActionSheetItem[];
    cancelText?: React.ReactNode;
    isClosable?: boolean;
    shouldCloseOnOverlayPress?: boolean;
    className?: string;
    classNames?: Partial<ActionSheetClassNames>;
    style?: React.CSSProperties;
    onOpenChange?: (isOpen: boolean) => void;
    onAction?: (value: ActionSheetValue, index: number, item: ActionSheetItem) => void;
    onCancel?: () => void;
  };
