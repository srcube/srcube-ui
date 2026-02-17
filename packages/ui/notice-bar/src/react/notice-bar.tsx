import * as React from 'react';
import { noticeBar } from '../style';
import type { NoticeBarReactProps } from './props';

export const NoticeBar = React.forwardRef<HTMLDivElement, NoticeBarReactProps>(
  (props, ref) => {
    const {
      text,
      icon,
      action,
      isClosable = false,
      isVisible,
      defaultVisible = true,
      color,
      size,
      className,
      classNames,
      style,
      onClose,
      onVisibleChange,
      children,
      ...rest
    } = props;

    const isControlled = isVisible !== null && isVisible !== undefined;
    const [innerVisible, setInnerVisible] = React.useState(Boolean(defaultVisible));
    const visible = isControlled ? Boolean(isVisible) : innerVisible;

    const slots = React.useMemo(
      () =>
        noticeBar({
          color,
          size,
        }),
      [color, size],
    );

    const setVisible = React.useCallback(
      (nextVisible: boolean) => {
        if (!isControlled) {
          setInnerVisible(nextVisible);
        }
        onVisibleChange?.(nextVisible);
      },
      [isControlled, onVisibleChange],
    );

    const handleClose = React.useCallback(() => {
      setVisible(false);
      onClose?.();
    }, [onClose, setVisible]);

    if (!visible) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={slots.base({ class: [classNames?.base, className] })}
        style={style}
        {...rest}
      >
        {icon ? <span className={slots.icon({ class: classNames?.icon })}>{icon}</span> : null}
        <div className={slots.content({ class: classNames?.content })}>
          <div className={slots.text({ class: classNames?.text })}>{children ?? text}</div>
        </div>
        {action ? <div className={slots.action({ class: classNames?.action })}>{action}</div> : null}
        {isClosable ? (
          <button
            type="button"
            className={slots.close({ class: classNames?.close })}
            onClick={handleClose}
            aria-label="Close"
          >
            x
          </button>
        ) : null}
      </div>
    );
  },
);

NoticeBar.displayName = 'Srcube.NoticeBar';
