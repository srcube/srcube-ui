import * as React from 'react';
import { skeletonStyle } from '@srcube-ui/styles/components/skeleton';
import type { SkeletonReactProps } from './props';

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonReactProps>(
  (props, ref) => {
    const {
      tone,
      radius,
      isLoaded = false,
      className,
      classNames,
      style,
      children,
      ...rest
    } = props;

    const slots = React.useMemo(
      () =>
        skeletonStyle({
          tone,
          radius,
          isLoaded,
        }),
      [isLoaded, radius, tone],
    );

    const classes = React.useMemo(
      () => ({
        base: slots.base({ class: [classNames?.base, className] }),
        content: slots.content({ class: classNames?.content }),
        placeholder: slots.placeholder({ class: classNames?.placeholder }),
      }),
      [
        className,
        classNames?.base,
        classNames?.content,
        classNames?.placeholder,
        slots,
      ],
    );

    return (
      <div ref={ref} className={classes.base} style={style} {...rest}>
        <div className={classes.content}>{children}</div>
        <div aria-hidden className={classes.placeholder} />
      </div>
    );
  },
);

Skeleton.displayName = 'Srcube.Skeleton';
