import type {
  TimelineColor,
  TimelineMiniClassNames,
  TimelineVariants,
} from '../style';

export type TimelineMiniItem = {
  key?: string | number;
  title?: string;
  description?: string;
  time?: string;
  icon?: string;
  color?: TimelineColor;
  isPending?: boolean;
};

export type TimelineMiniProps = Omit<TimelineVariants, 'isPending' | 'isLast'> & {
  id?: string;
  items?: TimelineMiniItem[];
  className?: string;
  classNames?: Partial<TimelineMiniClassNames>;
  style?: string;
};

export const timelineMiniProps = {
  id: {
    type: String,
    value: '',
  },
  items: {
    type: Array,
    value: [],
  },
  size: {
    type: null,
    value: 'md',
  },
  color: {
    type: null,
    value: 'default',
  },
  lineStyle: {
    type: null,
    value: 'solid',
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
