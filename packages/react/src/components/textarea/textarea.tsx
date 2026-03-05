import { Field } from '../field';
import type { FieldClassNames } from '@srcube-ui/styles/components/field';
import * as React from 'react';
import { textareaStyle } from '@srcube-ui/styles/components/textarea';
import type { TextareaReactProps } from './props';

function mergeClassName(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function normalizeValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
}

function resolveMaxCountLabel(maxLength?: number): string {
  if (
    typeof maxLength !== 'number' ||
    Number.isNaN(maxLength) ||
    maxLength < 0
  ) {
    return '♾️';
  }

  return String(Math.floor(maxLength));
}

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaReactProps
>((props, ref) => {
  const {
    id,
    label,
    labelPlacement,
    value,
    defaultValue,
    placeholder,
    description,
    errorMessage,
    startContent,
    endContent,
    clearButton,
    isClearable,
    isDisabled,
    isReadOnly,
    isInvalid,
    isRequired,
    isLoading,
    color,
    variant,
    size,
    radius,
    className,
    classNames,
    controlProps,
    textareaClassName,
    showCount,
    style,
    onValueChange,
    isAutoHeight,
    rows,
    maxLength,
    onClear,
    onTap,
    onChange,
    ...restTextareaProps
  } = props;

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const isControlled = value !== undefined;
  const [countValue, setCountValue] = React.useState(() =>
    normalizeValue(value ?? defaultValue),
  );

  const slots = textareaStyle({
    size,
    isDisabled: Boolean(isDisabled),
    isAutoHeight,
  });

  const isOutsideLeftLabel = labelPlacement === 'outside-left';
  const fieldClassNames = {
    ...classNames,
    base: mergeClassName(
      classNames?.base,
      isOutsideLeftLabel ? 'items-start' : undefined,
    ),
    controlWrapper: mergeClassName(classNames?.controlWrapper, 'py-2'),
    control: mergeClassName(
      classNames?.control,
      slots.control(),
      'h-auto min-h-0 items-start',
    ),
    input: mergeClassName(
      classNames?.input,
      'items-start py-0.5 overflow-visible whitespace-normal text-clip',
    ),
    startContent: mergeClassName(
      classNames?.startContent,
      'self-start h-[1.5em]',
    ),
    endContent: mergeClassName(classNames?.endContent, slots.endContent()),
    clearButton: mergeClassName(classNames?.clearButton, slots.clearButton()),
  } satisfies Partial<FieldClassNames>;

  const textareaClass = slots.textarea({ class: textareaClassName });
  const maxCountLabel = resolveMaxCountLabel(maxLength);
  const countLabel = `${countValue.length}/${maxCountLabel}`;

  React.useEffect(() => {
    if (value === undefined) {
      return;
    }

    setCountValue(normalizeValue(value));
  }, [value]);

  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setCountValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange],
  );

  const handleClear = React.useCallback(() => {
    onClear?.();
  }, [onClear]);

  const resolvedEndContent = React.useMemo(() => {
    if (!showCount) {
      return endContent;
    }

    return (
      <span className={slots.endMeta()}>
        {endContent ? <span>{endContent}</span> : null}
        <span className={slots.count()}>{countLabel}</span>
      </span>
    );
  }, [countLabel, endContent, showCount, slots]);

  const syncAutoHeight = React.useCallback(
    (target?: HTMLTextAreaElement | null) => {
      if (!isAutoHeight) {
        return;
      }

      const textarea = target ?? textareaRef.current;
      if (!textarea) {
        return;
      }

      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    },
    [isAutoHeight],
  );

  React.useEffect(() => {
    syncAutoHeight();
  }, [syncAutoHeight, value]);

  return (
    <Field
      id={id}
      label={label}
      labelPlacement={labelPlacement}
      description={description}
      errorMessage={errorMessage}
      startContent={startContent}
      endContent={resolvedEndContent}
      clearButton={clearButton}
      isClearable={isClearable}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={isInvalid}
      isRequired={isRequired}
      isLoading={isLoading}
      isMultiline
      color={color}
      variant={variant}
      size={size}
      radius={radius}
      className={className}
      classNames={fieldClassNames}
      controlProps={controlProps}
      style={style}
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      onValueChange={handleValueChange}
      onClear={handleClear}
      onTap={onTap}
    >
      {({
        id,
        value: fieldValue,
        onValueChange: handleFieldValueChange,
        isDisabled,
        isReadOnly,
        isInvalid,
      }) => (
        <textarea
          {...restTextareaProps}
          ref={(node) => {
            textareaRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
              return;
            }

            if (ref) {
              ref.current = node;
            }
          }}
          id={id}
          className={textareaClass}
          value={fieldValue}
          rows={rows}
          maxLength={maxLength}
          placeholder={placeholder}
          disabled={isDisabled}
          readOnly={isReadOnly}
          aria-invalid={isInvalid || undefined}
          onChange={(event) => {
            handleFieldValueChange(event.target.value);
            onChange?.(event);
            syncAutoHeight(event.currentTarget);
          }}
        />
      )}
    </Field>
  );
});

Textarea.displayName = 'Srcube.Textarea';
