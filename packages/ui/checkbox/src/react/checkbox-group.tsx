import { composeTwRenderProps } from '@srcube-ui/runtime/react';
import * as React from 'react';
import { CheckboxGroup as AriaCheckboxGroup } from 'react-aria-components';
import { checkboxGroup } from '../style';
import type { CheckboxGroupReactProps } from './props';

type CheckboxGroupContextValue = {
  color?: NonNullable<CheckboxGroupReactProps['color']>;
  size?: NonNullable<CheckboxGroupReactProps['size']>;
  radius?: NonNullable<CheckboxGroupReactProps['radius']>;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isLineThrough?: boolean;
};

const CheckboxGroupContext =
  React.createContext<CheckboxGroupContextValue | null>(null);

export function useCheckboxGroupContext() {
  return React.useContext(CheckboxGroupContext);
}

export const CheckboxGroup: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<CheckboxGroupReactProps> &
    React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, CheckboxGroupReactProps>((props, ref) => {
  const {
    value,
    defaultValue,
    onValueChange,
    orientation = 'y',
    isBlock = false,
    color,
    size,
    radius,
    isDisabled = false,
    isReadOnly = false,
    isLineThrough = false,
    className,
    children,
    ...rest
  } = props;

  const baseClassName = composeTwRenderProps(
    className,
    checkboxGroup({ orientation, isBlock }),
  );

  const contextValue = React.useMemo<CheckboxGroupContextValue>(
    () => ({
      color,
      size,
      radius,
      isDisabled,
      isReadOnly,
      isLineThrough,
    }),
    [color, size, radius, isDisabled, isReadOnly, isLineThrough],
  );

  const handleChange = React.useCallback(
    (next: string[]) => {
      onValueChange?.(next);
    },
    [onValueChange],
  );

  return (
    <CheckboxGroupContext.Provider value={contextValue}>
      <AriaCheckboxGroup
        ref={ref}
        value={value ?? undefined}
        defaultValue={defaultValue ?? undefined}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        className={baseClassName}
        onChange={handleChange}
        {...rest}
      >
        {children}
      </AriaCheckboxGroup>
    </CheckboxGroupContext.Provider>
  );
});

CheckboxGroup.displayName = 'Srcube.CheckboxGroup';
