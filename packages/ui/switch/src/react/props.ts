import type * as React from 'react';
import type {
  SwitchProps as AriaSwitchProps,
  SwitchRenderProps,
} from 'react-aria-components';
import type { SwitchClasses, SwitchClassNames, SwitchVariants } from '../style';

type SwitchNativeProps = Omit<
  AriaSwitchProps,
  | 'children'
  | 'className'
  | 'value'
  | 'isDisabled'
  | 'isReadOnly'
  | 'onChange'
  | 'isSelected'
  | 'defaultSelected'
>;

export type SwitchIconRenderProps = {
  isSelected: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  className: string;
};

export type SwitchReactProps = SwitchVariants &
  SwitchNativeProps & {
    children?:
      | React.ReactNode
      | ((state: SwitchRenderProps) => React.ReactNode);
    value?: string;
    defaultSelected?: boolean;
    isSelected?: boolean;
    isLoading?: boolean | 'auto';
    isDisabled?: boolean;
    isReadOnly?: boolean;
    className?: AriaSwitchProps['className'];
    classNames?: SwitchClassNames;
    icon?:
      | React.ReactNode
      | ((props: SwitchIconRenderProps) => React.ReactNode);
    onValueChange?: (isSelected: boolean) => void;
    onTap?: () => void | Promise<void>;
  };

export type { SwitchClasses };
