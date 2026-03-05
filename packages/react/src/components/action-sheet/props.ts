import type * as React from 'react';
import type { ButtonReactProps } from '../button';
import type { ActionSheetLocale } from './locale';
import type {
  ActionSheetActionColor,
  ActionSheetClassNames,
  ActionSheetVariants,
} from '@srcube-ui/styles/components/action-sheet';

type ActionSheetVisualVariants = Omit<ActionSheetVariants, 'isOpen'>;

export type ActionSheetValue = string | number;

export type ActionSheetItem = {
  value: ActionSheetValue;
  label: React.ReactNode;
  description?: React.ReactNode;
  color?: ActionSheetActionColor;
  isDisabled?: boolean;
};

export type ActionSheetCancelButtonProps = Omit<ButtonReactProps, 'children'>;

type ActionSheetNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | 'onChange' | keyof ActionSheetVisualVariants
>;

export type ActionSheetReactProps = ActionSheetVisualVariants &
  ActionSheetNativeProps & {
    isOpen?: boolean;
    defaultOpen?: boolean;
    title?: React.ReactNode;
    description?: React.ReactNode;
    actions: ActionSheetItem[];
    hasFooter?: boolean;
    footer?: React.ReactNode;
    cancelText?: React.ReactNode;
    cancelButtonProps?: ActionSheetCancelButtonProps;
    locale?: ActionSheetLocale;
    isClosable?: boolean;
    className?: string;
    classNames?: Partial<ActionSheetClassNames>;
    style?: React.CSSProperties;
    onOpenChange?: (isOpen: boolean) => void;
    onAction?: (value: ActionSheetValue, index: number, item: ActionSheetItem) => void;
    onCancel?: () => void;
  };
