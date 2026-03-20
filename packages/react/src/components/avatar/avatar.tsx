import { Skeleton } from '../skeleton';
import * as React from 'react';
import {
  createAvatarFallbackSeed,
  getAvatarGradientLayerStyles,
  getAvatarGradientTextStyle,
  resolveAvatarFallbackStyle,
  resolveAvatarGradientTheme,
} from './fallback';
import { avatar } from '@srcube-ui/styles/components/avatar';
import type { AvatarReactProps } from './props';

function getInitials(name?: string) {
  if (!name) {
    return '';
  }

  const words = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);

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
      fallbackStyle,
      fallbackTheme,
      fallbackSeed,
      size,
      radius,
      color,
      tone,
      isBordered,
      className,
      classNames,
      style,
      ...rest
    } = props;

    const [hasError, setHasError] = React.useState(false);
    const [isImageLoaded, setIsImageLoaded] = React.useState<boolean>(
      () => !src,
    );

    React.useEffect(() => {
      setHasError(false);
      setIsImageLoaded(!src);
    }, [src]);

    const slots = React.useMemo(
      () =>
        avatar({
          size,
          radius,
          color,
          tone,
          isBordered,
        }),
      [color, isBordered, radius, size, tone],
    );

    const initials = getInitials(name);
    const showImage = Boolean(src) && !hasError;
    const isLoading = showImage && !isImageLoaded;
    const fallbackContent = (fallback ?? icon ?? initials) || '?';
    const resolvedFallbackStyle = resolveAvatarFallbackStyle(fallbackStyle);
    const fallbackSeedValue = createAvatarFallbackSeed(
      fallbackSeed,
      name,
      alt,
      src,
      typeof fallbackContent === 'string' || typeof fallbackContent === 'number'
        ? String(fallbackContent)
        : '',
    );
    const resolvedFallbackTheme = resolveAvatarGradientTheme({
      fallbackTheme,
      seed: fallbackSeedValue,
    });
    const isGradientOrb = resolvedFallbackStyle === 'gradient-orb';
    const gradientStyles = getAvatarGradientLayerStyles(resolvedFallbackTheme);

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
            {isGradientOrb ? (
              <>
                <span
                  aria-hidden
                  data-sr-avatar-orb="base"
                  className={slots.fallbackOrb({
                    class: classNames?.fallbackOrb,
                  })}
                  style={gradientStyles.orb}
                />
                <span
                  aria-hidden
                  data-sr-avatar-orb="glow"
                  className={slots.fallbackGlow({
                    class: classNames?.fallbackGlow,
                  })}
                  style={gradientStyles.glow}
                />
                <span
                  aria-hidden
                  data-sr-avatar-orb="highlight"
                  className={slots.fallbackHighlight({
                    class: classNames?.fallbackHighlight,
                  })}
                />
              </>
            ) : null}
            <span
              className={slots.fallbackText({
                class: classNames?.fallbackText,
              })}
              style={isGradientOrb ? getAvatarGradientTextStyle() : undefined}
            >
              {fallbackContent}
            </span>
          </span>
        )}
      </Skeleton>
    );
  },
);

Avatar.displayName = 'Srcube.Avatar';
