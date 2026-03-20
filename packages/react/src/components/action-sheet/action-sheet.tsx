import * as React from 'react';
import { Button, ButtonGroup } from '../button';
import { composeTwRenderProps } from '../../shared/compose';
import {
  Popup,
  PopupContent,
  type PopupClassNames,
  type PopupRef,
} from '../popup';
import {
  ACTION_SHEET_CANCEL_TEXT,
  DEFAULT_ACTION_SHEET_LOCALE,
} from './locale';
import {
  actionSheet,
  actionSheetAction,
  type ActionSheetActionColor,
} from '@srcube-ui/styles/components/action-sheet';
import type {
  ActionSheetCancelButtonProps,
  ActionSheetItem,
  ActionSheetReactProps,
} from './props';

const DEFAULT_ACTION_COLOR: ActionSheetActionColor = 'default';

function resolveRadiusBySize(size: NonNullable<ActionSheetReactProps['size']>) {
  switch (size) {
    case 'sm':
      return 'sm';
    case 'lg':
      return 'lg';
    default:
      return 'md';
  }
}

export const ActionSheet = React.forwardRef<PopupRef, ActionSheetReactProps>(
  (props, ref) => {
    const {
      isOpen,
      defaultOpen = false,
      title,
      description,
      actions,
      hasFooter = false,
      cancelText,
      cancelButtonProps,
      footer,
      locale = DEFAULT_ACTION_SHEET_LOCALE,
      isClosable = true,
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
    const resolvedSize = size ?? 'md';
    const resolvedRadius = radius ?? resolveRadiusBySize(resolvedSize);
    const resolvedCancelText = cancelText ?? ACTION_SHEET_CANCEL_TEXT[locale];
    const hasCustomFooter = footer !== null && footer !== undefined;
    const resolvedHasFooter = hasFooter || hasCustomFooter;

    const {
      className: cancelButtonClassName,
      onTap: onCancelButtonTap,
      ...restCancelButtonProps
    } = cancelButtonProps ?? {};

    const slots = React.useMemo(
      () =>
        actionSheet({
          isOpen: open,
          size: resolvedSize,
          radius: resolvedRadius,
          isInset,
        }),
      [open, resolvedRadius, resolvedSize, isInset],
    );

    const cancelButtonMergedClassName = React.useMemo(
      () =>
        composeTwRenderProps(
          cancelButtonClassName,
          slots.cancel({ class: classNames?.cancel }),
        ),
      [cancelButtonClassName, classNames?.cancel, slots],
    );

    const popupClassNames = React.useMemo<Partial<PopupClassNames>>(
      () => ({
        base: slots.base({ class: [classNames?.base, className] }),
        backdrop: slots.overlay({ class: classNames?.overlay }),
        content: slots.panel({ class: classNames?.panel }),
      }),
      [className, classNames, slots],
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

    const handleCancelTap = React.useCallback(
      (
        event: Parameters<
          NonNullable<ActionSheetCancelButtonProps['onTap']>
        >[0],
      ) => {
        onCancelButtonTap?.(event);
        handleCancel();
      },
      [handleCancel, onCancelButtonTap],
    );

    return (
      <Popup
        ref={ref}
        {...rest}
        isOpen={open}
        hasBackdrop
        isDismissable={false}
        motion="none"
        onOpenChange={setOpen}
        classNames={popupClassNames}
        style={style}
      >
        <PopupContent>
          <div className={slots.content({ class: classNames?.content })}>
            {title || description ? (
              <div className={slots.header({ class: classNames?.header })}>
                {title ? (
                  <div className={slots.title({ class: classNames?.title })}>
                    {title}
                  </div>
                ) : null}
                {description ? (
                  <div
                    className={slots.description({
                      class: classNames?.description,
                    })}
                  >
                    {description}
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className={slots.list({ class: classNames?.list })}>
              <ButtonGroup
                orientation="y"
                isBlock
                variant="text"
                size={resolvedSize}
                radius="none"
                className={slots.actionGroup({
                  class: classNames?.actionGroup,
                })}
              >
                {actions.flatMap((item, index) => {
                  const nodes: React.ReactNode[] = [];
                  const itemColor = item.color ?? DEFAULT_ACTION_COLOR;
                  const itemActionClass = actionSheetAction({
                    color: itemColor,
                  });

                  if (index > 0) {
                    nodes.push(
                      <div
                        key={`divider:${index}`}
                        className={slots.actionDivider({
                          class: classNames?.actionDivider,
                        })}
                      />,
                    );
                  }

                  nodes.push(
                    <Button
                      key={`action:${typeof item.value}:${String(
                        item.value,
                      )}:${index}`}
                      variant="text"
                      color="default"
                      radius="none"
                      isDisabled={Boolean(item.isDisabled)}
                      isBlock
                      className={slots.action({
                        class: [
                          classNames?.action,
                          itemActionClass,
                          index === actions.length - 1
                            ? slots.actionLast({
                                class: classNames?.actionLast,
                              })
                            : '',
                        ],
                      })}
                      onTap={() => {
                        handleAction(item, index);
                      }}
                    >
                      <span
                        className={slots.actionContent({
                          class: classNames?.actionContent,
                        })}
                      >
                        <span
                          className={slots.actionLabel({
                            class: classNames?.actionLabel,
                          })}
                        >
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
                      </span>
                    </Button>,
                  );

                  return nodes;
                })}
              </ButtonGroup>
            </div>
          </div>

          {resolvedHasFooter ? (
            <div className={slots.footer({ class: classNames?.footer })}>
              {footer}
            </div>
          ) : null}

          {!resolvedHasFooter && isClosable ? (
            <div className={slots.footer({ class: classNames?.footer })}>
              <ButtonGroup
                orientation="y"
                isBlock
                variant="text"
                color="default"
                size={resolvedSize}
                radius={resolvedRadius}
                className={slots.cancelGroup({
                  class: classNames?.cancelGroup,
                })}
              >
                <Button
                  {...restCancelButtonProps}
                  isBlock={restCancelButtonProps.isBlock ?? true}
                  className={cancelButtonMergedClassName}
                  onTap={handleCancelTap}
                >
                  {resolvedCancelText}
                </Button>
              </ButtonGroup>
            </div>
          ) : null}
        </PopupContent>
      </Popup>
    );
  },
);

ActionSheet.displayName = 'Srcube.ActionSheet';
