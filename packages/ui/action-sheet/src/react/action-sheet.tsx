import * as React from 'react';
import { actionSheet, actionSheetActionState } from '../style';
import type { ActionSheetItem, ActionSheetReactProps } from './props';

export const ActionSheet = React.forwardRef<HTMLDivElement, ActionSheetReactProps>(
  (props, ref) => {
    const {
      isOpen,
      defaultOpen = false,
      title,
      description,
      actions,
      cancelText = '取消',
      isClosable = true,
      shouldCloseOnOverlayPress = true,
      size,
      radius,
      isInset,
      className,
      classNames,
      style,
      onOpenChange,
      onAction,
      onCancel,
      ...rest
    } = props;

    const isControlled = isOpen !== null && isOpen !== undefined;
    const [innerOpen, setInnerOpen] = React.useState(Boolean(defaultOpen));
    const open = isControlled ? Boolean(isOpen) : innerOpen;

    const slots = React.useMemo(
      () =>
        actionSheet({
          size,
          radius,
          isInset,
        }),
      [isInset, radius, size],
    );

    const setOpen = React.useCallback(
      (nextOpen: boolean) => {
        if (!isControlled) {
          setInnerOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
      },
      [isControlled, onOpenChange],
    );

    const handleAction = React.useCallback(
      (item: ActionSheetItem, index: number) => {
        if (item.isDisabled) {
          return;
        }

        onAction?.(item.value, index, item);
        setOpen(false);
      },
      [onAction, setOpen],
    );

    const handleCancel = React.useCallback(() => {
      onCancel?.();
      setOpen(false);
    }, [onCancel, setOpen]);

    if (!open) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={slots.base({ class: [classNames?.base, className] })}
        style={style}
        role="dialog"
        aria-modal="true"
        {...rest}
      >
        <div
          className={slots.overlay({ class: classNames?.overlay })}
          onClick={() => {
            if (shouldCloseOnOverlayPress) {
              handleCancel();
            }
          }}
        />

        <div className={slots.panel({ class: classNames?.panel })}>
          {title || description ? (
            <div className={slots.header({ class: classNames?.header })}>
              {title ? <div className={slots.title({ class: classNames?.title })}>{title}</div> : null}
              {description ? (
                <div className={slots.description({ class: classNames?.description })}>
                  {description}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className={slots.list({ class: classNames?.list })}>
            {actions.map((item, index) => {
              const actionState = actionSheetActionState({
                color: item.color,
                isDisabled: Boolean(item.isDisabled),
              });

              return (
                <button
                  key={`${typeof item.value}:${String(item.value)}`}
                  type="button"
                  className={slots.action({ class: [classNames?.action, actionState] })}
                  onClick={() => {
                    handleAction(item, index);
                  }}
                  disabled={item.isDisabled}
                >
                  <span className={slots.actionLabel({ class: classNames?.actionLabel })}>
                    {item.label}
                  </span>
                  {item.description ? (
                    <span
                      className={slots.actionDescription({
                        class: classNames?.actionDescription,
                      })}
                    >
                      {item.description}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {isClosable ? (
            <button
              type="button"
              className={slots.cancel({ class: classNames?.cancel })}
              onClick={handleCancel}
            >
              {cancelText}
            </button>
          ) : null}
        </div>
      </div>
    );
  },
);

ActionSheet.displayName = 'Srcube.ActionSheet';
