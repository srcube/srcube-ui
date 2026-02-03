import type * as React from "react";
import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import type {
  ButtonClasses,
  ButtonGroupVariants,
  ButtonVariants,
} from "../style";

type ButtonNativeProps = Omit<
  AriaButtonProps,
  "className" | "style" | keyof ButtonVariants | "onPress"
>;

export type ButtonTapHandler = (
  event: Parameters<NonNullable<AriaButtonProps["onPress"]>>[0],
) => void | Promise<void>;

export interface ButtonReactProps extends ButtonVariants, ButtonNativeProps {
  className?: AriaButtonProps["className"];
  classNames?: ButtonClasses;
  style?: AriaButtonProps["style"];
  onTap?: ButtonTapHandler;
}

type GroupSharedProps = Pick<
  ButtonVariants,
  "color" | "variant" | "size" | "radius" | "isDisabled"
>;

type ButtonGroupNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "color"
>;

export interface ButtonGroupReactProps
  extends ButtonGroupVariants,
    GroupSharedProps,
    ButtonGroupNativeProps {
  children?: React.ReactNode;
}
