import type * as React from 'react';
import { componentStyles } from '../style';
import type { ComponentReactProps } from './props';

export function Component(props: ComponentReactProps) {
  const { className, style, isDisabled, children, ...rest } =
    props as ComponentReactProps & { children?: React.ReactNode };

  const styleClass = typeof style === 'string' ? style : '';
  const styleObj = typeof style === 'string' ? undefined : style;

  const classes = [componentStyles.base, styleClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      style={styleObj as React.CSSProperties | undefined}
      aria-disabled={isDisabled}
      data-disabled={isDisabled ? 'true' : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}
