import * as React from 'react';
import { avatar } from '../style';
import type { AvatarReactProps } from './props';

function getInitials(name?: string) {
  if (!name) {
    return '';
  }

  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  return words.map((word) => word[0]?.toUpperCase() ?? '').join('');
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarReactProps>(
  (props, ref) => {
    const {
      src,
      alt,
      name,
      icon,
      size,
      radius,
      color,
      isBordered,
      className,
      classNames,
      style,
      ...rest
    } = props;

    const [hasError, setHasError] = React.useState(false);

    React.useEffect(() => {
      setHasError(false);
    }, [src]);

    const slots = React.useMemo(
      () =>
        avatar({
          size,
          radius,
          color,
          isBordered,
        }),
      [color, isBordered, radius, size],
    );

    const initials = getInitials(name);
    const showImage = Boolean(src) && !hasError;

    return (
      <div
        ref={ref}
        className={slots.base({ class: [classNames?.base, className] })}
        style={style}
        {...rest}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt ?? name ?? ''}
            className={slots.image({ class: classNames?.image })}
            onError={() => {
              setHasError(true);
            }}
          />
        ) : (
          <span className={slots.fallback({ class: classNames?.fallback })}>
            {(icon ?? initials) || '?'}
          </span>
        )}
      </div>
    );
  },
);

Avatar.displayName = 'Srcube.Avatar';
