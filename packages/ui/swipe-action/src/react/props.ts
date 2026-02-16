import type * as React from 'react';
import type {
  SwipeActionActionToneColors,
  SwipeActionReactClassNames,
  SwipeActionVariants,
} from '../style';

export type SwipeActionDirection = 'none' | 'left' | 'right';

export type SwipeActionItem = {
  key: string | number;
  label: React.ReactNode;
  color?: SwipeActionActionToneColors;
  isDisabled?: boolean;
  className?: string;
};

export type SwipeActionActionDetail = {
  key: string | number;
  direction: Exclude<SwipeActionDirection, 'none'>;
  index: number;
  item: SwipeActionItem;
  event: React.MouseEvent<HTMLButtonElement>;
};

type SwipeActionNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'className' | 'style' | 'onChange' | keyof SwipeActionVariants
>;

export type SwipeActionReactProps = SwipeActionVariants &
  SwipeActionNativeProps & {
    leftActions?: SwipeActionItem[];
    rightActions?: SwipeActionItem[];
    actionWidth?: number;
    threshold?: number;
    openDirection?: SwipeActionDirection | null;
    defaultOpenDirection?: SwipeActionDirection;
    isDisabled?: boolean;
    className?: string;
    classNames?: Partial<SwipeActionReactClassNames>;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onTap?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onAction?: (detail: SwipeActionActionDetail) => void;
    onOpenDirectionChange?: (direction: SwipeActionDirection) => void;
  };
