import type * as React from 'react';
import type {
  CalendarClassNames,
  CalendarMode,
  CalendarVariants,
} from '../style';

export type CalendarRangeValue = {
  start?: string;
  end?: string;
};

type CalendarBaseVariants = Omit<
  CalendarVariants,
  'dayStatus' | 'isRangeStart' | 'isRangeEnd'
>;

type CalendarBaseNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | keyof CalendarVariants
>;

export type CalendarBaseProps = CalendarBaseVariants &
  CalendarBaseNativeProps & {
    month?: string;
    minDate?: string;
    maxDate?: string;
    disabledDates?: string[];
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    helperText?: React.ReactNode;
    className?: string;
    classNames?: Partial<CalendarClassNames>;
    style?: React.CSSProperties;
    onMonthChange?: (month: string) => void;
  };

export type CalendarReactProps = CalendarBaseProps & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export type CalendarRangeReactProps = CalendarBaseProps & {
  value?: CalendarRangeValue;
  defaultValue?: CalendarRangeValue;
  onValueChange?: (value: CalendarRangeValue) => void;
};

export type CalendarInternalMode = CalendarMode;
