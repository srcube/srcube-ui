import * as React from 'react';
import { accordion, accordionIconState, accordionItemState } from '../style';
import type {
  AccordionChangeValue,
  AccordionReactProps,
  AccordionSelectionMode,
  AccordionValue,
} from './props';

function toValueArray(
  input: AccordionChangeValue | undefined,
  selectionMode: AccordionSelectionMode,
): AccordionValue[] {
  if (input === null || input === undefined) {
    return [];
  }

  if (Array.isArray(input)) {
    if (selectionMode === 'single') {
      return input.length > 0 ? [input[0] as AccordionValue] : [];
    }

    return input as AccordionValue[];
  }

  return [input as AccordionValue];
}

function toChangeValue(
  values: AccordionValue[],
  selectionMode: AccordionSelectionMode,
): AccordionChangeValue {
  if (selectionMode === 'single') {
    return values[0] ?? null;
  }

  return values;
}

function areValuesEqual(left: AccordionValue[], right: AccordionValue[]) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionReactProps>(
  (props, ref) => {
    const {
      items,
      selectionMode = 'single',
      value,
      defaultValue,
      variant,
      size,
      radius,
      isSeparated,
      isDisabled = false,
      hasIndicator = true,
      indicator,
      className,
      classNames,
      style,
      onValueChange,
      ...rest
    } = props;

    const isControlled = value !== null && value !== undefined;
    const controlledValues = React.useMemo(
      () => toValueArray(value, selectionMode),
      [selectionMode, value],
    );

    const [innerValues, setInnerValues] = React.useState<AccordionValue[]>(() =>
      toValueArray(defaultValue, selectionMode),
    );

    React.useEffect(() => {
      if (isControlled && !areValuesEqual(innerValues, controlledValues)) {
        setInnerValues(controlledValues);
      }
    }, [controlledValues, innerValues, isControlled]);

    const activeValues = isControlled ? controlledValues : innerValues;

    const slots = React.useMemo(
      () =>
        accordion({
          variant,
          size,
          radius,
          isSeparated,
        }),
      [isSeparated, radius, size, variant],
    );

    const handleToggle = React.useCallback(
      (targetValue: AccordionValue, itemDisabled?: boolean) => {
        if (isDisabled || itemDisabled) {
          return;
        }

        const exists = activeValues.includes(targetValue);
        let nextValues: AccordionValue[];

        if (selectionMode === 'multiple') {
          nextValues = exists
            ? activeValues.filter((valueItem) => valueItem !== targetValue)
            : [...activeValues, targetValue];
        } else {
          nextValues = exists ? [] : [targetValue];
        }

        if (!isControlled) {
          setInnerValues(nextValues);
        }

        onValueChange?.(toChangeValue(nextValues, selectionMode));
      },
      [activeValues, isControlled, isDisabled, onValueChange, selectionMode],
    );

    return (
      <div
        ref={ref}
        className={slots.base({ class: [classNames?.base, className] })}
        style={style}
        {...rest}
      >
        {items.map((item) => {
          const isExpanded = activeValues.includes(item.value);
          const itemState = accordionItemState({
            isExpanded,
            isDisabled: Boolean(isDisabled || item.isDisabled),
          });
          const iconState = accordionIconState({ isExpanded });

          return (
            <div
              key={`${typeof item.value}:${String(item.value)}`}
              className={slots.item({ class: [classNames?.item, itemState] })}
            >
              <button
                type="button"
                className={slots.trigger({ class: classNames?.trigger })}
                onClick={() => {
                  handleToggle(item.value, item.isDisabled);
                }}
                aria-expanded={isExpanded}
                aria-disabled={isDisabled || item.isDisabled ? true : undefined}
              >
                <span className={slots.title({ class: classNames?.title })}>
                  {item.title}
                </span>
                {hasIndicator ? (
                  <span
                    className={slots.icon({
                      class: [classNames?.icon, iconState],
                    })}
                    aria-hidden="true"
                  >
                    {indicator ?? 'v'}
                  </span>
                ) : null}
              </button>

              {isExpanded ? (
                <div className={slots.panel({ class: classNames?.panel })}>
                  <div className={slots.content({ class: classNames?.content })}>
                    {item.content}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  },
);

Accordion.displayName = 'Srcube.Accordion';
