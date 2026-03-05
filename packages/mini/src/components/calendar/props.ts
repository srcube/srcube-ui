import type {
  CalendarMiniClassNames,
  CalendarMode,
  CalendarVariants,
} from '@srcube-ui/styles/components/calendar/style';

export type CalendarMiniRangeValue = {
  start?: string;
  end?: string;
};

export type CalendarMiniProps = Omit<
  CalendarVariants,
  'dayStatus' | 'isRangeStart' | 'isRangeEnd'
> & {
  id?: string;
  mode?: CalendarMode;
  value?: string;
  rangeValue?: CalendarMiniRangeValue;
  month?: string;
  minDate?: string;
  maxDate?: string;
  disabledDates?: string[];
  weekStartsOn?: number;
  helperText?: string;
  className?: string;
  classNames?: Partial<CalendarMiniClassNames>;
  style?: string;
};

export const calendarMiniProps = {
  id: {
    type: String,
    value: '',
  },
  mode: {
    type: null,
    value: 'single',
  },
  value: {
    type: String,
    value: '',
  },
  rangeValue: {
    type: Object,
    value: {},
  },
  month: {
    type: String,
    value: '',
  },
  minDate: {
    type: String,
    value: '',
  },
  maxDate: {
    type: String,
    value: '',
  },
  disabledDates: {
    type: Array,
    value: [],
  },
  weekStartsOn: {
    type: Number,
    value: 0,
  },
  helperText: {
    type: String,
    value: '',
  },
  size: {
    type: null,
    value: 'md',
  },
  radius: {
    type: null,
    value: 'md',
  },
  color: {
    type: null,
    value: 'primary',
  },
  className: {
    type: String,
    value: '',
  },
  classNames: {
    type: Object,
    value: {},
  },
  style: {
    type: String,
    value: '',
  },
} as const;
