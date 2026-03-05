import * as React from 'react';
import { createPortal } from 'react-dom';
import { imageStyle } from '@srcube-ui/styles/components/image';
import type { ImagePreviewReactProps, ImageReactProps } from './props';

function useCloseOnEscape(isOpen: boolean, onClose: () => void) {
  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
}

function PreviewLayer(props: ImagePreviewReactProps) {
  const { src, isOpen = false, onOpenChange, classNames } = props;
  const slots = React.useMemo(() => imageStyle(), []);

  useCloseOnEscape(
    Boolean(isOpen),
    React.useCallback(() => {
      onOpenChange?.(false);
    }, [onOpenChange]),
  );

  if (!isOpen || !src || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <>
      <div
        className={slots.previewMask({ class: classNames?.previewMask })}
        onClick={() => {
          onOpenChange?.(false);
        }}
      />
      <div className={slots.previewBody({ class: classNames?.previewBody })}>
        <img
          src={src}
          alt="preview"
          className={slots.previewImage({ class: classNames?.previewImage })}
          onClick={(event) => {
            event.stopPropagation();
          }}
        />
        <button
          type="button"
          className={slots.previewClose({ class: classNames?.previewClose })}
          onClick={() => {
            onOpenChange?.(false);
          }}
          aria-label="Close preview"
        >
          ×
        </button>
      </div>
    </>,
    document.body,
  );
}

export const ImagePreview = PreviewLayer;

export const Image = React.forwardRef<HTMLDivElement, ImageReactProps>(
  (props, ref) => {
    const {
      src,
      alt,
      fallback,
      loadingText,
      previewSrc,
      previewUrls,
      onImageLoad,
      onImageError,
      size,
      radius,
      fit,
      ratio,
      isBlock,
      isPreviewable = false,
      className,
      classNames,
      style,
      ...rest
    } = props;

    const [hasError, setHasError] = React.useState(false);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
      setHasError(false);
      setIsLoaded(false);
    }, [src]);

    const status: 'normal' | 'loading' | 'error' = React.useMemo(() => {
      if (!src || hasError) {
        return 'error';
      }
      if (!isLoaded) {
        return 'loading';
      }
      return 'normal';
    }, [hasError, isLoaded, src]);

    const slots = React.useMemo(
      () =>
        imageStyle({
          size,
          radius,
          fit,
          ratio,
          isBlock,
          status,
          isPreviewable,
        }),
      [fit, isBlock, isPreviewable, radius, ratio, size, status],
    );

    const resolvedPreviewSrc =
      previewSrc || src || previewUrls?.[0] || '';

    const canPreview = Boolean(isPreviewable && resolvedPreviewSrc);
    const placeholderContent =
      status === 'loading' ? (loadingText ?? 'Loading...') : (fallback ?? 'Image unavailable');

    return (
      <>
        <div
          ref={ref}
          className={slots.base({ class: [classNames?.base, className] })}
          style={style}
          onClick={(event) => {
            if (canPreview) {
              event.preventDefault();
              setOpen(true);
            }
          }}
          {...rest}
        >
          {src ? (
            <img
              src={src}
              alt={alt ?? ''}
              className={slots.image({ class: classNames?.image })}
              onLoad={() => {
                setIsLoaded(true);
                onImageLoad?.();
              }}
              onError={() => {
                setHasError(true);
                onImageError?.();
              }}
            />
          ) : null}

          <span className={slots.placeholder({ class: classNames?.placeholder })}>
            {placeholderContent}
          </span>
        </div>

        <PreviewLayer
          src={resolvedPreviewSrc}
          isOpen={open}
          onOpenChange={setOpen}
          classNames={classNames}
        />
      </>
    );
  },
);

Image.displayName = 'Srcube.Image';
