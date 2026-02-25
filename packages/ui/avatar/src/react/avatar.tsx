import * as React from 'react';
import { Skeleton } from '@srcube-ui/skeleton/react';
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
      fallback,
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
    const [isImageLoaded, setIsImageLoaded] = React.useState<boolean>(() => !Boolean(src));

    React.useEffect(() => {
      setHasError(false);
      setIsImageLoaded(!Boolean(src));
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
    const isLoading = showImage && !isImageLoaded;
    const fallbackContent = (fallback ?? icon ?? initials) || '?';

    return (
      <Skeleton
        ref={ref}
        radius={radius}
        isLoaded={!isLoading}
        className={slots.base({ class: [classNames?.base, className] })}
        classNames={{
          content: 'h-full w-full flex items-center justify-center',
        }}
        style={style}
        {...rest}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt ?? name ?? ''}
            className={slots.image({ class: classNames?.image })}
            onLoad={() => {
              setIsImageLoaded(true);
            }}
            onError={() => {
              setHasError(true);
              setIsImageLoaded(true);
            }}
          />
        ) : (
          <span className={slots.fallback({ class: classNames?.fallback })}>
            {fallbackContent}
          </span>
        )}
      </Skeleton>
    );
  },
);

Avatar.displayName = 'Srcube.Avatar';
