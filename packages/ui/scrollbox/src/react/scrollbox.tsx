import type React from 'react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { scrollbox } from '../style';
import type { ScrollboxReactProps } from './props';

type ScrollboxOrientation = 'x' | 'y' | 'xy';

type ScrollboxMaskState = {
  showMaskTop: boolean;
  showMaskBottom: boolean;
  showMaskLeft: boolean;
  showMaskRight: boolean;
};

type ScrollboxMetrics = {
  scrollTop: number;
  scrollLeft: number;
  scrollHeight: number;
  scrollWidth: number;
  clientHeight: number;
  clientWidth: number;
};

const EDGE_EPSILON = 1;

function resolveScrollboxOrientation(
  value?: ScrollboxOrientation | null,
): ScrollboxOrientation {
  return value ?? 'y';
}

function getScrollboxAxes(orientation: ScrollboxOrientation) {
  return {
    scrollX: orientation === 'x' || orientation === 'xy',
    scrollY: orientation === 'y' || orientation === 'xy',
  };
}

function getScrollboxMaskState({
  orientation,
  hideMasks,
  metrics,
}: {
  orientation: ScrollboxOrientation;
  hideMasks?: boolean;
  metrics: ScrollboxMetrics;
}): ScrollboxMaskState {
  if (hideMasks) {
    return {
      showMaskTop: false,
      showMaskBottom: false,
      showMaskLeft: false,
      showMaskRight: false,
    };
  }

  const { scrollX, scrollY } = getScrollboxAxes(orientation);
  const {
    scrollTop,
    scrollLeft,
    scrollHeight,
    scrollWidth,
    clientHeight,
    clientWidth,
  } = metrics;

  return {
    showMaskTop: scrollY && scrollTop > 0,
    showMaskBottom:
      scrollY && scrollTop + clientHeight < scrollHeight - EDGE_EPSILON,
    showMaskLeft: scrollX && scrollLeft > 0,
    showMaskRight:
      scrollX && scrollLeft + clientWidth < scrollWidth - EDGE_EPSILON,
  };
}

const initialMaskState: ScrollboxMaskState = {
  showMaskTop: false,
  showMaskBottom: false,
  showMaskLeft: false,
  showMaskRight: false,
};

export const Scrollbox = forwardRef<HTMLDivElement, ScrollboxReactProps>(
  (props, ref) => {
    const {
      orientation,
      hideMasks = false,
      scrollX,
      scrollY,
      upperThreshold = 50,
      lowerThreshold = 50,
      scrollTop,
      scrollLeft,
      scrollIntoView,
      scrollWithAnimation = false,
      enableBackToTop,
      showScrollbar,
      enhanced,
      bounces,
      pagingEnabled,
      fastDeceleration,
      enableFlex,
      scrollAnchoring,
      refresherEnabled,
      refresherThreshold,
      refresherDefaultStyle,
      refresherBackground,
      refresherTriggered,
      className,
      classNames,
      children,
      onScroll,
      onScrollToUpper,
      onScrollToLower,
      scrollRef: scrollRefProp,
      overlay,
      ...rest
    } = props;

    const scrollRef = useRef<HTMLDivElement>(null);
    const upperReachedRef = useRef(false);
    const lowerReachedRef = useRef(false);
    const [maskState, setMaskState] =
      useState<ScrollboxMaskState>(initialMaskState);

    const setScrollRef = useCallback(
      (node: HTMLDivElement | null) => {
        scrollRef.current = node;
        if (typeof scrollRefProp === 'function') {
          scrollRefProp(node);
        } else if (scrollRefProp && 'current' in scrollRefProp) {
          scrollRefProp.current = node;
        }
      },
      [scrollRefProp],
    );

    const updateMasks = useCallback(() => {
      const node = scrollRef.current;
      if (!node) return;

      const metrics = {
        scrollTop: node.scrollTop,
        scrollLeft: node.scrollLeft,
        scrollHeight: node.scrollHeight,
        scrollWidth: node.scrollWidth,
        clientHeight: node.clientHeight,
        clientWidth: node.clientWidth,
      };

      const nextState = getScrollboxMaskState({
        orientation: resolveScrollboxOrientation(orientation),
        hideMasks,
        metrics,
      });

      setMaskState(nextState);
    }, [orientation, hideMasks]);

    useEffect(() => {
      updateMasks();
    }, [updateMasks]);

    useEffect(() => {
      const node = scrollRef.current;
      if (!node || typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(() => updateMasks());
      observer.observe(node);
      return () => observer.disconnect();
    }, [updateMasks]);

    const resolvedOrientation = resolveScrollboxOrientation(orientation);
    const axes = useMemo(() => {
      const baseAxes = getScrollboxAxes(resolvedOrientation);
      return {
        scrollX: scrollX ?? baseAxes.scrollX,
        scrollY: scrollY ?? baseAxes.scrollY,
      };
    }, [resolvedOrientation, scrollX, scrollY]);

    const classes = useMemo(
      () =>
        scrollbox({
          orientation: resolvedOrientation,
          hideMasks,
          showMaskTop: maskState.showMaskTop,
          showMaskBottom: maskState.showMaskBottom,
          showMaskLeft: maskState.showMaskLeft,
          showMaskRight: maskState.showMaskRight,
        }),
      [resolvedOrientation, hideMasks, maskState],
    );

    const wrapperClassName = classes.wrapper({
      class: [classNames?.wrapper, className],
    });

    const scrollViewClassName = [
      classes.scrollview({ class: classNames?.scrollview }),
      axes.scrollY && !axes.scrollX && 'overflow-y-auto overflow-x-hidden',
      axes.scrollX && !axes.scrollY && 'overflow-x-auto overflow-y-hidden',
      axes.scrollX && axes.scrollY && 'overflow-auto',
      showScrollbar === false && 'scrollbar-none',
    ]
      .filter(Boolean)
      .join(' ');

    const scrollViewStyle = useMemo<React.CSSProperties | undefined>(() => {
      if (scrollAnchoring === undefined) return undefined;
      return {
        overflowAnchor: scrollAnchoring ? 'auto' : 'none',
      };
    }, [scrollAnchoring]);

    useEffect(() => {
      const node = scrollRef.current;
      if (!node) return;
      if (scrollTop == null && scrollLeft == null) return;

      node.scrollTo({
        top: scrollTop ?? node.scrollTop,
        left: scrollLeft ?? node.scrollLeft,
        behavior: scrollWithAnimation ? 'smooth' : 'auto',
      });

      updateMasks();
    }, [scrollTop, scrollLeft, scrollWithAnimation, updateMasks]);

    useEffect(() => {
      const node = scrollRef.current;
      if (!node || !scrollIntoView) return;

      const selector =
        typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
          ? `#${CSS.escape(scrollIntoView)}`
          : `#${scrollIntoView}`;
      const target = node.querySelector<HTMLElement>(selector);
      if (!target) return;

      target.scrollIntoView({
        behavior: scrollWithAnimation ? 'smooth' : 'auto',
        block: 'nearest',
        inline: 'nearest',
      });

      updateMasks();
    }, [scrollIntoView, scrollWithAnimation, updateMasks]);

    const ignoredProps = {
      enableBackToTop,
      enhanced,
      bounces,
      pagingEnabled,
      fastDeceleration,
      enableFlex,
      refresherEnabled,
      refresherThreshold,
      refresherDefaultStyle,
      refresherBackground,
      refresherTriggered,
    };
    void ignoredProps;

    const handleScroll = useCallback(
      (event: React.UIEvent<HTMLDivElement>) => {
        updateMasks();
        if (onScrollToUpper || onScrollToLower) {
          const node = scrollRef.current;
          if (node) {
            const metrics = {
              scrollTop: node.scrollTop,
              scrollLeft: node.scrollLeft,
              scrollHeight: node.scrollHeight,
              scrollWidth: node.scrollWidth,
              clientHeight: node.clientHeight,
              clientWidth: node.clientWidth,
            };

            const atUpper =
              (axes.scrollY && metrics.scrollTop <= upperThreshold) ||
              (axes.scrollX && metrics.scrollLeft <= upperThreshold);
            const atLower =
              (axes.scrollY &&
                metrics.scrollTop + metrics.clientHeight >=
                  metrics.scrollHeight - lowerThreshold) ||
              (axes.scrollX &&
                metrics.scrollLeft + metrics.clientWidth >=
                  metrics.scrollWidth - lowerThreshold);

            if (atUpper) {
              if (!upperReachedRef.current) {
                upperReachedRef.current = true;
                onScrollToUpper?.(event);
              }
            } else {
              upperReachedRef.current = false;
            }

            if (atLower) {
              if (!lowerReachedRef.current) {
                lowerReachedRef.current = true;
                onScrollToLower?.(event);
              }
            } else {
              lowerReachedRef.current = false;
            }
          }
        }
        onScroll?.(event);
      },
      [
        updateMasks,
        onScroll,
        onScrollToUpper,
        onScrollToLower,
        axes.scrollX,
        axes.scrollY,
        upperThreshold,
        lowerThreshold,
      ],
    );

    return (
      <div ref={ref} className={wrapperClassName} {...rest}>
        <div
          ref={setScrollRef}
          className={scrollViewClassName}
          style={scrollViewStyle}
          onScroll={handleScroll}
        >
          <div className={classes.content({ class: classNames?.content })}>
            {children}
          </div>
        </div>
        {overlay}
        <div className={classes.maskTop({ class: classNames?.maskTop })} />
        <div
          className={classes.maskBottom({ class: classNames?.maskBottom })}
        />
        <div className={classes.maskLeft({ class: classNames?.maskLeft })} />
        <div className={classes.maskRight({ class: classNames?.maskRight })} />
      </div>
    );
  },
);

Scrollbox.displayName = 'Srcube.Scrollbox';
