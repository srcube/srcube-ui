import { Field } from '@srcube-ui/field/react';
import type { FieldClassNames } from '@srcube-ui/field/style';
import * as React from 'react';
import { inputStyle } from '../style';
import type { InputReactProps } from './props';

function mergeClassName(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export const Input = React.forwardRef<HTMLInputElement, InputReactProps>(
  (props, ref) => {
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
      inputClassName,
      style,
      onValueChange,
      onClear,
      onTap,
      onChange,
      ...restInputProps
    } = props;

    const slots = inputStyle({
      size,
      isDisabled: Boolean(isDisabled),
    });

    const fieldClassNames = {
      ...classNames,
      control: mergeClassName(classNames?.control, slots.control()),
    } satisfies Partial<FieldClassNames>;

    const inputClass = slots.input({ class: inputClassName });

    return (
      <Field
        id={id}
        label={label}
        labelPlacement={labelPlacement}
        description={description}
        errorMessage={errorMessage}
        startContent={startContent}
        endContent={endContent}
        clearButton={clearButton}
        isClearable={isClearable}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isInvalid={isInvalid}
        isRequired={isRequired}
        isLoading={isLoading}
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
        onValueChange={onValueChange}
        onClear={onClear}
        onTap={onTap}
      >
        {({
          id,
          className: fieldInputClass,
          value: fieldValue,
          onValueChange: handleFieldValueChange,
          isDisabled,
          isReadOnly,
          isInvalid,
        }) => (
          <input
            {...restInputProps}
            ref={ref}
            id={id}
            className={mergeClassName(fieldInputClass, inputClass)}
            value={fieldValue}
            placeholder={placeholder}
            disabled={isDisabled}
            readOnly={isReadOnly}
            aria-invalid={isInvalid || undefined}
            onChange={(event) => {
              handleFieldValueChange(event.target.value);
              onChange?.(event);
            }}
          />
        )}
      </Field>
    );
  },
);

Input.displayName = 'Srcube.Input';
