import type { SkeletonMiniClassNames, SkeletonVariants } from '@srcube-ui/styles/components/skeleton/style';

export type SkeletonMiniProps = SkeletonVariants & {
  id?: string;
  isLoaded?: boolean;
  className?: string;
  classNames?: Partial<SkeletonMiniClassNames>;
  style?: string;
};

export const skeletonMiniProps = {
  id: {
    type: String,
    value: '',
  },
  tone: {
    type: null,
    value: 'default',
  },
  isLoaded: {
    type: Boolean,
    value: false,
  },
  radius: {
    type: null,
    value: null,
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
