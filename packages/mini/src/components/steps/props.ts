import type { StepStatus, StepsMiniClassNames, StepsVariants } from '@srcube-ui/styles/components/steps/style';

export type StepsMiniItem = {
  key?: string | number;
  title?: string;
  description?: string;
  icon?: string;
  status?: StepStatus;
};

export type StepsMiniProps = Omit<
  StepsVariants,
  'status' | 'isLast' | 'isFirst' | 'orientation'
> & {
  id?: string;
  items?: StepsMiniItem[];
  current?: number;
  orientation?: 'x' | 'y';
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
  orientation: {
    type: null,
    value: 'x',
  },
  size: {
    type: null,
    value: 'md',
  },
  color: {
    type: null,
    value: 'primary',
  },
  variant: {
    type: null,
    value: 'solid',
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
