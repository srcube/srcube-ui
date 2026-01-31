import type * as React from "react";
import { component } from "../style";
import type { ComponentVariants } from "../style";
import type { ComponentReactProps } from "./props";

export function Component(props: ComponentReactProps) {
  const { className, classNames, style, children, ...rest } = props;

  const styleObj = typeof style === "string" ? undefined : style;
  const variantKeys = component.variantKeys ?? [];
  const variantProps: Record<string, unknown> = {};
  const nativeProps: Record<string, unknown> = {};

  for (const key of Object.keys(rest)) {
    if (variantKeys.includes(key as never)) {
      variantProps[key] = (rest as Record<string, unknown>)[key];
    } else {
      nativeProps[key] = (rest as Record<string, unknown>)[key];
    }
  }

  const slots = component(variantProps as ComponentVariants);
  const baseClass = slots.base({ class: [classNames?.base, className] });

  return (
    <div
      className={baseClass}
      style={styleObj as React.CSSProperties | undefined}
      {...nativeProps}
    >
      {children}
    </div>
  );
}
