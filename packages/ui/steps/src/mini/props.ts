import type { StepStatus, StepsMiniClassNames, StepsVariants } from '../style';

export type StepsMiniItem = {
  key?: string | number;
  title?: string;
  description?: string;
  icon?: string;
  status?: StepStatus;
};

export type StepsMiniProps = Omit<StepsVariants, 'status' | 'isLast'> & {
  id?: string;
  items?: StepsMiniItem[];
  current?: number;
  className?: string;
  classNames?: Partial<StepsMiniClassNames>;
  style?: string;
};

export const stepsMiniProps = {
  id: {
    type: String,
    value: '',
  },
  items: {
    type: Array,
    value: [],
  },
  current: {
    type: Number,
    value: 0,
  },
  direction: {
    type: null,
    value: 'horizontal',
  },
  size: {
    type: null,
    value: 'md',
  },
  isDot: {
    type: Boolean,
    value: false,
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
