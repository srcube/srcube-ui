import type * as React from 'react';
import type {
  RadioGroupProps as AriaRadioGroupProps,
  RadioProps as AriaRadioProps,
  RadioRenderProps,
} from 'react-aria-components';
import type { RadioClasses, RadioGroupVariants, RadioVariants } from '../style';

export type RadioIconRenderProps = {
  isSelected: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  className: string;
};

type RadioPressEvent = Parameters<NonNullable<AriaRadioProps['onPress']>>[0];

type RadioNativeProps = Omit<
  AriaRadioProps,
  'children' | 'className' | 'value' | 'isDisabled' | 'onPress'
>;

type RadioGroupSharedProps = Pick<
  RadioVariants,
  'color' | 'size' | 'isDisabled' | 'isReadOnly'
>;

type RadioGroupNativeProps = Omit<
  AriaRadioGroupProps,
  | 'children'
  | 'className'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'orientation'
>;

export type RadioReactProps = RadioVariants &
  RadioNativeProps & {
    children?: React.ReactNode | ((state: RadioRenderProps) => React.ReactNode);
    value?: string;
    defaultSelected?: boolean;
    isSelected?: boolean;
    isLoading?: boolean | 'auto';
    isDisabled?: boolean;
    isReadOnly?: boolean;
    className?: AriaRadioProps['className'];
    classNames?: RadioClasses;
    icon?: React.ReactNode | ((props: RadioIconRenderProps) => React.ReactNode);
    onValueChange?: (isSelected: boolean) => void;
    onTap?: (event: RadioPressEvent) => void | Promise<void>;
  };

export type RadioGroupReactProps = RadioGroupVariants &
  RadioGroupSharedProps &
  RadioGroupNativeProps & {
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string) => void;
    className?: AriaRadioGroupProps['className'];
    children?: React.ReactNode;
  };
