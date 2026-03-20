import type * as React from "react";
import type {
  CheckboxGroupProps as AriaCheckboxGroupProps,
  CheckboxProps as AriaCheckboxProps,
  CheckboxRenderProps,
} from "react-aria-components";
import type {
  CheckboxClasses,
  CheckboxGroupVariants,
  CheckboxVariants,
} from "@srcube-ui/styles/components/checkbox";

export type CheckboxIconRenderProps = {
  isIndeterminate: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  className: string;
};

type CheckboxPressEvent = Parameters<
  NonNullable<AriaCheckboxProps["onPress"]>
>[0];

type CheckboxNativeProps = Omit<
  AriaCheckboxProps,
  | "children"
  | "className"
  | "value"
  | "isDisabled"
  | "isReadOnly"
  | "onPress"
  | "onChange"
  | "isSelected"
  | "defaultSelected"
  | "isIndeterminate"
>;

type CheckboxGroupSharedProps = Pick<
  CheckboxVariants,
  | "color"
  | "tone"
  | "size"
  | "radius"
  | "isDisabled"
  | "isReadOnly"
  | "isLineThrough"
>;

type CheckboxGroupNativeProps = Omit<
  AriaCheckboxGroupProps,
  | "children"
  | "className"
  | "value"
  | "defaultValue"
  | "onChange"
  | "orientation"
>;

export type CheckboxReactProps = CheckboxVariants &
  CheckboxNativeProps & {
    children?:
      | React.ReactNode
      | ((state: CheckboxRenderProps) => React.ReactNode);
    value?: string;
    defaultSelected?: boolean;
    isSelected?: boolean;
    isIndeterminate?: boolean;
    isLoading?: boolean | "auto";
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isLineThrough?: boolean;
    className?: AriaCheckboxProps["className"];
    classNames?: CheckboxClasses;
    icon?:
      | React.ReactNode
      | ((props: CheckboxIconRenderProps) => React.ReactNode);
    onValueChange?: (isSelected: boolean) => void;
    onTap?: (event: CheckboxPressEvent) => void | Promise<void>;
  };

export type CheckboxGroupReactProps = CheckboxGroupVariants &
  CheckboxGroupSharedProps &
  CheckboxGroupNativeProps & {
    value?: string[] | null;
    defaultValue?: string[] | null;
    onValueChange?: (value: string[]) => void;
    className?: AriaCheckboxGroupProps["className"];
    children?: React.ReactNode;
  };
