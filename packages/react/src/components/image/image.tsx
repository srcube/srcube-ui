import { imageStyle } from '@srcube-ui/styles/components/image';
import * as React from 'react';
import { createPortal } from 'react-dom';
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

const PREVIEW_DOUBLE_TAP_MS = 260;
const PREVIEW_DOUBLE_TAP_ZOOM_MS = 500;
const PREVIEW_MIN_SCALE = 1;
const PREVIEW_PAN_THRESHOLD = 4;
const PREVIEW_SCALE_EPSILON = 0.01;
const PREVIEW_PINCH_OVERSHOOT_CAP = 0.9;
const PREVIEW_PINCH_BOUNCE_MS = 280;

type PreviewPoint = {
  x: number;
  y: number;
};

function applyScaleResistance(value: number, min: number, max: number): number {
  if (value > max) {
    const over = value - max;
    return max + over / (1 + over / PREVIEW_PINCH_OVERSHOOT_CAP);
  }

  if (value < min) {
    const below = min - value;
    return min - below / (1 + below / PREVIEW_PINCH_OVERSHOOT_CAP);
  }

  return value;
}

function PreviewLayer(props: ImagePreviewReactProps) {
  const {
    src,
    tone = 'default',
    isOpen = false,
    onOpenChange,
    classNames,
  } = props;
  const slots = React.useMemo(() => imageStyle({ tone }), [tone]);
  const [scale, setScale] = React.useState(1);
  const [offset, setOffset] = React.useState<PreviewPoint>({
    x: 0,
    y: 0,
  });
  const [transitionMs, setTransitionMs] = React.useState(0);
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  const scaleRef = React.useRef(1);
  const offsetRef = React.useRef<PreviewPoint>({
    x: 0,
    y: 0,
  });
  const lastTapAtRef = React.useRef(0);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const pinchStartDistanceRef = React.useRef(0);
  const pinchStartScaleRef = React.useRef(1);
  const ignoreTapUntilRef = React.useRef(0);
  const panStartPointRef = React.useRef<PreviewPoint | null>(null);
  const panStartOffsetRef = React.useRef<PreviewPoint>({
    x: 0,
    y: 0,
  });
  const panMovedRef = React.useRef(false);

  React.useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  React.useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  const resolvePreviewMetrics = React.useCallback(() => {
    const viewportWidth = Math.max(1, Number(window.innerWidth ?? 0));
    const viewportHeight = Math.max(1, Number(window.innerHeight ?? 0));
    const naturalWidth = Number(imageRef.current?.naturalWidth ?? 0);
    const naturalHeight = Number(imageRef.current?.naturalHeight ?? 0);

    let baseWidth = viewportWidth;
    let baseHeight = viewportHeight;

    if (naturalWidth > 0 && naturalHeight > 0) {
      const imageRatio = naturalWidth / naturalHeight;
      const viewportRatio = viewportWidth / viewportHeight;

      if (imageRatio > viewportRatio) {
        baseWidth = viewportWidth;
        baseHeight = viewportWidth / imageRatio;
      } else {
        baseHeight = viewportHeight;
        baseWidth = viewportHeight * imageRatio;
      }
    }

    const scaleToFullWidth = viewportWidth / Math.max(1, baseWidth);
    const scaleToFullHeight = viewportHeight / Math.max(1, baseHeight);
    const maxScale = Math.max(
      2,
      Math.max(scaleToFullWidth, scaleToFullHeight) * 2,
    );

    return {
      viewportWidth,
      viewportHeight,
      baseWidth,
      baseHeight,
      maxScale,
    };
  }, []);
  const clampScale = React.useCallback(
    (value: number) => {
      const { maxScale } = resolvePreviewMetrics();
      return Math.max(PREVIEW_MIN_SCALE, Math.min(maxScale, value));
    },
    [resolvePreviewMetrics],
  );
  const getTouchDistance = React.useCallback((touches: React.TouchList) => {
    if (touches.length < 2) {
      return 0;
    }
    const first = touches[0];
    const second = touches[1];
    const deltaX = second.clientX - first.clientX;
    const deltaY = second.clientY - first.clientY;
    return Math.hypot(deltaX, deltaY);
  }, []);
  const resolveMaxOffset = React.useCallback(
    (nextScale: number) => {
      if (nextScale <= PREVIEW_MIN_SCALE) {
        return {
          maxX: 0,
          maxY: 0,
        };
      }

      const { viewportWidth, viewportHeight, baseWidth, baseHeight } =
        resolvePreviewMetrics();

      return {
        maxX: Math.max(0, (baseWidth * nextScale - viewportWidth) / 2),
        maxY: Math.max(0, (baseHeight * nextScale - viewportHeight) / 2),
      };
    },
    [resolvePreviewMetrics],
  );
  const clampOffset = React.useCallback(
    (x: number, y: number, nextScale: number): PreviewPoint => {
      const { maxX, maxY } = resolveMaxOffset(nextScale);
      return {
        x: Math.max(-maxX, Math.min(maxX, x)),
        y: Math.max(-maxY, Math.min(maxY, y)),
      };
    },
    [resolveMaxOffset],
  );
  const applyPreviewTransform = React.useCallback(
    (nextScale: number, nextOffset: PreviewPoint) => {
      setScale(nextScale);
      scaleRef.current = nextScale;
      setOffset(nextOffset);
      offsetRef.current = nextOffset;
    },
    [],
  );
  const zoomAtPoint = React.useCallback(
    (nextScaleInput: number, point: PreviewPoint) => {
      const previousScale = Math.max(PREVIEW_MIN_SCALE, scaleRef.current);
      const nextScale = clampScale(nextScaleInput);

      if (nextScale <= PREVIEW_MIN_SCALE) {
        applyPreviewTransform(PREVIEW_MIN_SCALE, {
          x: 0,
          y: 0,
        });
        return;
      }

      const { viewportWidth, viewportHeight } = resolvePreviewMetrics();
      const centerX = viewportWidth / 2;
      const centerY = viewportHeight / 2;
      const tapX = Number.isFinite(point.x) ? point.x : centerX;
      const tapY = Number.isFinite(point.y) ? point.y : centerY;

      const ratio = nextScale / previousScale;
      const rawOffsetX =
        offsetRef.current.x * ratio + (tapX - centerX) * (1 - ratio);
      const rawOffsetY =
        offsetRef.current.y * ratio + (tapY - centerY) * (1 - ratio);
      const nextOffset = clampOffset(rawOffsetX, rawOffsetY, nextScale);

      applyPreviewTransform(nextScale, nextOffset);
    },
    [applyPreviewTransform, clampOffset, clampScale, resolvePreviewMetrics],
  );
  const resolveDoubleTapTargetScale = React.useCallback(() => {
    const { viewportHeight, baseHeight } = resolvePreviewMetrics();
    if (baseHeight < viewportHeight - 0.5) {
      return viewportHeight / Math.max(1, baseHeight);
    }

    return (scaleRef.current || PREVIEW_MIN_SCALE) * 2;
  }, [resolvePreviewMetrics]);

  const closePreview = React.useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setScale(1);
    setOffset({
      x: 0,
      y: 0,
    });
    setTransitionMs(0);
    scaleRef.current = 1;
    offsetRef.current = {
      x: 0,
      y: 0,
    };
    lastTapAtRef.current = 0;
    pinchStartDistanceRef.current = 0;
    pinchStartScaleRef.current = 1;
    ignoreTapUntilRef.current = 0;
    panStartPointRef.current = null;
    panMovedRef.current = false;
    onOpenChange?.(false);
  }, [onOpenChange]);

  useCloseOnEscape(Boolean(isOpen), closePreview);

  React.useEffect(() => {
    if (isOpen) {
      return;
    }

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setScale(1);
    setOffset({
      x: 0,
      y: 0,
    });
    setTransitionMs(0);
    scaleRef.current = 1;
    offsetRef.current = {
      x: 0,
      y: 0,
    };
    lastTapAtRef.current = 0;
    pinchStartDistanceRef.current = 0;
    pinchStartScaleRef.current = 1;
    ignoreTapUntilRef.current = 0;
    panStartPointRef.current = null;
    panMovedRef.current = false;
  }, [isOpen]);

  React.useEffect(
    () => () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    },
    [],
  );

  if (!isOpen || !src || typeof document === 'undefined') {
    return null;
  }

  const handlePreviewTap = (event: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (ignoreTapUntilRef.current > now) {
      return;
    }

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (now - lastTapAtRef.current <= PREVIEW_DOUBLE_TAP_MS) {
      const nextScale =
        scaleRef.current > PREVIEW_MIN_SCALE + PREVIEW_SCALE_EPSILON
          ? PREVIEW_MIN_SCALE
          : resolveDoubleTapTargetScale();
      setTransitionMs(PREVIEW_DOUBLE_TAP_ZOOM_MS);
      zoomAtPoint(nextScale, {
        x: event.clientX,
        y: event.clientY,
      });
      lastTapAtRef.current = 0;
      ignoreTapUntilRef.current = now + PREVIEW_DOUBLE_TAP_MS;
      return;
    }

    lastTapAtRef.current = now;
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      closePreview();
    }, PREVIEW_DOUBLE_TAP_MS);
  };

  return createPortal(
    <>
      <div
        aria-hidden
        className={slots.previewMask({ class: classNames?.previewMask })}
      />
      <div
        className={slots.previewBody({ class: classNames?.previewBody })}
        style={{ touchAction: 'none' }}
        onClick={handlePreviewTap}
        onTouchStart={(event) => {
          if (event.touches.length < 1) {
            return;
          }

          if (transitionMs > 0) {
            setTransitionMs(0);
          }

          if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
          }

          if (event.touches.length >= 2) {
            pinchStartDistanceRef.current = getTouchDistance(event.touches);
            pinchStartScaleRef.current = scaleRef.current;
            panStartPointRef.current = null;
            ignoreTapUntilRef.current = Date.now() + PREVIEW_DOUBLE_TAP_MS;
            return;
          }

          if (scaleRef.current <= PREVIEW_MIN_SCALE) {
            return;
          }

          const touch = event.touches[0];
          panStartPointRef.current = {
            x: touch.clientX,
            y: touch.clientY,
          };
          panStartOffsetRef.current = offsetRef.current;
          panMovedRef.current = false;
        }}
        onTouchMove={(event) => {
          if (event.touches.length >= 2) {
            const startDistance = pinchStartDistanceRef.current;
            if (startDistance <= 0) {
              return;
            }

            if (transitionMs > 0) {
              setTransitionMs(0);
            }

            event.preventDefault();
            const currentDistance = getTouchDistance(event.touches);
            const rawScale =
              (currentDistance / startDistance) * pinchStartScaleRef.current;
            const { maxScale } = resolvePreviewMetrics();
            const nextScale = applyScaleResistance(
              rawScale,
              PREVIEW_MIN_SCALE,
              maxScale,
            );
            const currentOffset = offsetRef.current;
            const nextOffset = clampOffset(
              currentOffset.x,
              currentOffset.y,
              nextScale,
            );
            setScale(nextScale);
            scaleRef.current = nextScale;
            setOffset(nextOffset);
            offsetRef.current = nextOffset;
            return;
          }

          if (event.touches.length < 1) {
            return;
          }

          const panStartPoint = panStartPointRef.current;
          if (!panStartPoint || scaleRef.current <= PREVIEW_MIN_SCALE) {
            return;
          }

          if (transitionMs > 0) {
            setTransitionMs(0);
          }

          event.preventDefault();
          const touch = event.touches[0];
          const deltaX = touch.clientX - panStartPoint.x;
          const deltaY = touch.clientY - panStartPoint.y;
          if (
            Math.abs(deltaX) > PREVIEW_PAN_THRESHOLD ||
            Math.abs(deltaY) > PREVIEW_PAN_THRESHOLD
          ) {
            panMovedRef.current = true;
          }

          const nextOffset = clampOffset(
            panStartOffsetRef.current.x + deltaX,
            panStartOffsetRef.current.y + deltaY,
            scaleRef.current,
          );
          setOffset(nextOffset);
          offsetRef.current = nextOffset;
        }}
        onTouchEnd={(event) => {
          if (event.touches.length >= 1) {
            return;
          }

          if (panMovedRef.current) {
            ignoreTapUntilRef.current = Date.now() + PREVIEW_DOUBLE_TAP_MS;
          }

          panStartPointRef.current = null;
          panMovedRef.current = false;
          pinchStartDistanceRef.current = 0;
          pinchStartScaleRef.current = scaleRef.current;

          const { maxScale } = resolvePreviewMetrics();
          const currentScale = scaleRef.current;
          if (
            currentScale > maxScale + PREVIEW_SCALE_EPSILON ||
            currentScale < PREVIEW_MIN_SCALE - PREVIEW_SCALE_EPSILON
          ) {
            const targetScale = clampScale(currentScale);
            const targetOffset = clampOffset(
              offsetRef.current.x,
              offsetRef.current.y,
              targetScale,
            );
            setTransitionMs(PREVIEW_PINCH_BOUNCE_MS);
            applyPreviewTransform(targetScale, targetOffset);
          }
        }}
      >
        <img
          ref={imageRef}
          src={src}
          alt="preview"
          className={slots.previewImage({ class: classNames?.previewImage })}
          onLoad={() => {
            const nextOffset = clampOffset(
              offsetRef.current.x,
              offsetRef.current.y,
              scaleRef.current,
            );
            setOffset(nextOffset);
            offsetRef.current = nextOffset;
          }}
          style={{
            width: '100vw',
            height: '100vh',
            objectFit: 'contain',
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
            transformOrigin: 'center center',
            transition:
              transitionMs > 0 ? `transform ${transitionMs}ms ease` : 'none',
            willChange: 'transform',
          }}
        />
      </div>
      <button
        type="button"
        aria-label="Close preview"
        className={slots.previewClose({ class: classNames?.previewClose })}
        onClick={() => {
          closePreview();
        }}
      >
        &times;
      </button>
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
      tone = 'default',
      onImageLoad,
      onImageError,
      radius,
      fit,
      ratio,
      isBlock,
      isPreviewable = false,
      className,
      classNames,
      style,
      width,
      height,
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
          tone,
          radius,
          fit,
          ratio,
          isBlock,
          status,
          isPreviewable,
        }),
      [fit, isBlock, isPreviewable, radius, ratio, status, tone],
    );

    const resolvedStyle = React.useMemo<React.CSSProperties | undefined>(() => {
      if (width == null && height == null) {
        return style;
      }

      return {
        ...(style ?? {}),
        ...(width != null ? { width } : {}),
        ...(height != null ? { height } : {}),
      };
    }, [height, style, width]);

    const resolvedPreviewSrc = previewSrc || src || previewUrls?.[0] || '';

    const canPreview = Boolean(isPreviewable && resolvedPreviewSrc);
    const placeholderContent =
      status === 'loading'
        ? (loadingText ?? 'Loading...')
        : (fallback ?? 'Image unavailable');

    return (
      <>
        <div
          ref={ref}
          className={slots.base({ class: [classNames?.base, className] })}
          style={resolvedStyle}
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

          <span
            className={slots.placeholder({ class: classNames?.placeholder })}
          >
            {placeholderContent}
          </span>
        </div>

        <PreviewLayer
          src={resolvedPreviewSrc}
          tone={tone}
          isOpen={open}
          onOpenChange={setOpen}
          classNames={classNames}
        />
      </>
    );
  },
);

Image.displayName = 'Srcube.Image';
