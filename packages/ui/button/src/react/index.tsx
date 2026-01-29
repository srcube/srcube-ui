import type * as React from 'react';
import { buttonStyles } from '../style';
import type { ButtonReactProps } from './props';

export function Button(props: ButtonReactProps) {
  const { className, style, isDisabled, children, ...rest } =
    props as ButtonReactProps & { children?: React.ReactNode };

  const styleClass = typeof style === 'string' ? style : '';
  const styleObj = typeof style === 'string' ? undefined : style;

  const classes = [buttonStyles.base, styleClass, className]
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
