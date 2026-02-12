import type { TabPanelClassNames } from '../../style';
import type { TabsMiniValue } from '../props';

export type TabPanelMiniProps = {
  value?: TabsMiniValue | null;
  activeValue?: TabsMiniValue | null;
  isActive?: boolean | null;
  keepMounted?: boolean;
  className?: string;
  classNames?: TabPanelClassNames;
  style?: string;
};

export const tabPanelMiniProps = {
  value: {
    type: null,
    value: null,
  },
  activeValue: {
    type: null,
    value: null,
  },
  isActive: {
    type: null,
    value: null,
  },
  keepMounted: {
    type: Boolean,
    value: false,
  },
  className: {
    type: String,
    value: '',
  },
  classNames: Object,
  style: {
    type: String,
    value: '',
  },
} as const;
